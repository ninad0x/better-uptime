import { prisma } from "store/client";

export async function getDashboardData() {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - 100); 

  const sites = await prisma.website.findMany({
    orderBy: { id: 'asc' }, 
    include: {
      metric: {
        where: { createdAt: { gte: timeWindow } },
        orderBy: { createdAt: 'asc' },
      }
    }
  });

  return sites.map((site) => {
  
    const lastMetric = site.metric[site.metric.length - 1];
    
    const statusText = lastMetric?.finalStatus ?? "Pending";

    const upCount = site.metric.filter(m => m.finalStatus === "Up").length;
    const totalCount = site.metric.length;

    const uptimePercent = totalCount > 0 ? (upCount / totalCount) * 100 : 0;
    console.log(site.name, uptimePercent);

    const avgList = site.metric.map((s) => s.avgResponseTimeMs ?? 0)
    
    const newAvgResTime = avgList.reduce((a, b) => a + b, 0) / avgList.length

    return {
      id: site.id,
      url: site.url,
      currentStatus: statusText,
      uptime: uptimePercent.toFixed(1),
      sparkline: site.metric.map(m => m.avgResponseTimeMs ?? 0),
      avgResponseTime: newAvgResTime.toFixed(1)
    };
  });
}