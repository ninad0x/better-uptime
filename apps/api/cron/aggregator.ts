import { schedule } from "node-cron"
import { prisma } from "store/client"
import { WebsiteStatus } from "../../../packages/store/generated/prisma/enums";

function computeMetrics(ticks: {
    status: WebsiteStatus;
    response_time_ms: number | null;
    region_id: string;
    }[]) {

        let upCount = 0;
        let totalCount = ticks.length;
        let latencySum = 0;
        const regionsDown = new Set<string>();

        for (const t of ticks) {
            if (t.status === "Up") {
                upCount++;

                if (t.response_time_ms !== null) {
                    latencySum += t.response_time_ms;
                }
            } else if (t.status === "Down") {
                regionsDown.add(t.region_id);
            }
        }

        return {
            uptime_percent: totalCount === 0 ? 0 : (upCount / totalCount) * 100,
            avg_response_time_ms: upCount === 0 ? null : Math.round(latencySum / upCount),
            regions_down_count: regionsDown.size,
            regions_down_list: Array.from(regionsDown),
            final_status: upCount > 2 ? WebsiteStatus.Up : WebsiteStatus.Down
        };
}


export const aggregateTick = schedule("*/6 * * * *", async () => {

    console.log("\nCRON + delay started", new Date().toLocaleTimeString());
    await new Promise(r => setTimeout(r, 25_000))  // delay to sync all regions
    console.log("delay end",new Date().toLocaleTimeString());

    const WINDOW_MS = 6 * 60 * 1000;  // time window  mins
    const now = Date.now();

    const windowEnd = new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);

    const windowStart = new Date(windowEnd.getTime() - WINDOW_MS);

    const ticks = await prisma.websiteTick.findMany({
        where: {
            created_at: {
                // gte: new Date("2025-12-15T16:00:26.136Z"),
                // lt: new Date("2025-12-15T16:03:56.766Z"),
                gte: windowStart,
                lt: windowEnd,
            },
        },
    });


    const groupTicks = new Map<string, typeof ticks>();

    for (const tick of ticks) {
        if (!groupTicks.has(tick.website_id)) {
            groupTicks.set(tick.website_id, [])
        }
        groupTicks.get(tick.website_id)!.push(tick)
    }

    const metricsData = []

    for (const [websiteId, websiteTicks] of groupTicks) {
        const metrics = computeMetrics(websiteTicks)

        metricsData.push({
            website_id: websiteId,
            window_start: windowStart,
            window_end: windowEnd,
            final_status: metrics.final_status,
            uptime_percent: metrics.uptime_percent,
            avg_response_time_ms: metrics.avg_response_time_ms,
            regions_down_count: metrics.regions_down_count,
            regions_down_list: metrics.regions_down_list
        })
    }

    const websiteMetric = await prisma.websiteMetric.createManyAndReturn({
        data: metricsData,
        skipDuplicates: true
    })

    console.log("created at", websiteMetric[0]?.created_at.toLocaleTimeString());
    console.log("\n\n");

})