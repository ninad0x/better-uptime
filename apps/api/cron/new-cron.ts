import { schedule } from "node-cron";
import { WebsiteStatus } from "../../../packages/store/generated/prisma/enums";
import { prisma } from "store/client";

export const aggregateMetrics = schedule("*/5 * * * *", async () => {
  console.log("Stats: Compressing history...");

  const now = new Date();
  const windowStart = new Date(now.getTime() - 5 * 60 * 1000); // Last 5 mins

  const groups = await prisma.websiteTick.groupBy({
    by: ["websiteId", "regionId", "status"],
    where: { createdAt: { gte: windowStart, lt: now } },
    _count: { _all: true },
    _avg: { responseTimeMs: true },
  });

  console.log(groups);

  const metricsMap = new Map<string, any>();

  for (const g of groups) {
    if (!metricsMap.has(g.websiteId)) {
      metricsMap.set(g.websiteId, {
        total: 0,
        up: 0,
        latSum: 0,
        latCount: 0,
        downRegions: new Set<string>()
      });
    }
    const m = metricsMap.get(g.websiteId);

    // Accumulate counts
    m.total += g._count._all;

    if (g.status === WebsiteStatus.Up) {
      m.up += g._count._all;
      
      // Weighted average calculation
      if (g._avg.responseTimeMs) {
        m.latSum += g._avg.responseTimeMs * g._count._all;
        m.latCount += g._count._all;
      }
    } else {
      m.downRegions.add(g.regionId); // Track specifically WHICH region failed
    }
  }

  const bulkTickEntry = Array.from(metricsMap.entries()).map(([siteId, m]) => {
    const uptime = m.total > 0 ? (m.up / m.total) * 100 : 0;
    const avgLat = m.latCount > 0 ? Math.round(m.latSum / m.latCount) : 0;
    
    // Logic: If uptime < 80% for this 10-min window, mark history as "Down"
    const isDown = uptime < 80;

    return {
      websiteId: siteId,
      windowStart,
      windowEnd: now,
      finalStatus: isDown ? WebsiteStatus.Down : WebsiteStatus.Up,
      uptimePercent: uptime,
      avgResponseTimeMs: avgLat,
      regionsDownCount: m.downRegions.size,
      regionsDownList: [...m.downRegions] as string[],
    };
  });

  if (bulkTickEntry.length > 0) {
    await prisma.websiteMetric.createMany({ data: bulkTickEntry });
    console.log(`Saved ${bulkTickEntry.length} metric rows.`);
  }
});