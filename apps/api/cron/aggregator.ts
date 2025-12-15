import { schedule } from "node-cron"
import { prisma } from "store/client"

const aggregateTick = schedule("*/5 * * * * *", async () => {
    console.log("CRON started");
    
    const WINDOW_MS = 5 * 60 * 1000;  // time window 5 mins
    const now = Date.now();
    const windowEnd = new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);
    const windowStart = new Date(windowEnd.getTime() - WINDOW_MS);


    const ticks = await prisma.websiteTick.findMany({
        where: {
            created_at: {
            gte: new Date("2025-12-15T16:01:30.050Z"),
            lte: new Date("2025-12-15T16:03:56.766Z"),
            },
        },
    });


    console.log(ticks.length);

    const groupTicks = new Map<string, typeof ticks>();

    for (const tick of ticks) {
        if (!groupTicks.has(tick.website_id)) {
            groupTicks.set(tick.website_id, [])
        }
        groupTicks.get(tick.website_id)!.push(tick)
    }

    console.log(groupTicks.entries());

    const websiteMetricPayload = groupTicks.forEach(() => ({
        
    }))

    const websiteMetric = await prisma.websiteMetric.create({
        data: 
    })

})