import { schedule } from "node-cron"
import { prisma } from "store/client"

function computeMetrics(ticks: {
    status: "Up" | "Down" | "Unknown";
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
        };
}


const aggregateTick = schedule("*/3 * * * * *", async () => {
    console.log("CRON started");
    
    const WINDOW_MS = 5 * 60 * 1000;  // time window 5 mins
    const now = Date.now();
    const windowEnd = new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);
    const windowStart = new Date(windowEnd.getTime() - WINDOW_MS);


    const ticks = await prisma.websiteTick.findMany({
        where: {
            created_at: {
                gte: new Date("2025-12-15T16:00:26.136Z"),
                lte: new Date("2025-12-15T16:03:56.766Z"),
                // gte: windowStart,
                // lte: windowEnd,
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

    

    const websiteMetricPayload = groupTicks.forEach((k) => {
        const data = computeMetrics(k)
        console.log(data);
    })

    // const websiteMetric = await prisma.websiteMetric.create({
    //     data: websiteMetricPayload
    // })

})