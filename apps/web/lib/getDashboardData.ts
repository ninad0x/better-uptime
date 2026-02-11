import { prisma } from "@repo/db/client";

type DashboardWebsite = {
  id: string
  name: string
  url: string
  currentStatus: number
  lastChecked: Date | null
  incidents: Array<{ id: string }>
  uptime24h: number
  avgResponseTime: number | null
}

export async function getDashboardData(userId: string): Promise<DashboardWebsite[]> {
  const websites = await prisma.website.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      url: true,
      currentStatus: true,
      lastChecked: true,
      incidents: {
        where: { endedAt: null },
        take: 1
      }
    }
  })

  // Calculate metrics per website
  const withMetrics = await Promise.all(
    websites.map(async (site) => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const metrics = await prisma.websiteMetric.findMany({
        where: {
          websiteId: site.id,
          windowStart: { gte: oneDayAgo }
        },
        select: {
          uptimePercent: true,
          avgResponseTimeMs: true
        }
      })

      const avgUptime = metrics.length 
        ? metrics.reduce((sum, m) => sum + m.uptimePercent, 0) / metrics.length
        : 100

      const avgResponse = metrics.length
        ? Math.round(metrics.reduce((sum, m) => sum + (m.avgResponseTimeMs || 0), 0) / metrics.length)
        : null

      return {
        ...site,
        uptime24h: avgUptime,
        avgResponseTime: avgResponse
      }
    })
  )

  return withMetrics
}