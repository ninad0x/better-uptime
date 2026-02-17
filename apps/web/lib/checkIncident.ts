import { prisma } from "@repo/db/client"

export async function checkIncidentForWebsite(websiteId: string): Promise<void> {
  const WINDOW_MS = 3 * 60 * 1000
  const cutoff = new Date(Date.now() - WINDOW_MS)

  try {
    // Get recent ticks
    const ticks = await prisma.websiteTick.findMany({
      where: { websiteId, createdAt: { gte: cutoff } },
      orderBy: { createdAt: "desc" },
      include: { region: { select: { name: true } } }
    })

    // Latest tick per region
    const byRegion = new Map()
    for (const tick of ticks) {
      if (!byRegion.has(tick.regionId)) byRegion.set(tick.regionId, tick)
    }

    // Need at least 2 regions
    if (byRegion.size < 2) return

    // Count down regions (status >= 400)
    const regions = Array.from(byRegion.values())
    const downRegions = regions.filter(t => t.status >= 400)
    const isDown = downRegions.length >= 2

    // Check for active incident
    const incident = await prisma.incident.findFirst({
      where: { websiteId, endedAt: null }
    })

    // Create incident if 2+ regions down
    if (isDown && !incident) {
      await prisma.incident.create({
        data: {
          websiteId,
          type: downRegions.length === regions.length ? "Global" : "Regional",
          status: "Ongoing",
          cause: downRegions.map(t => t.region.name).join(", ")
        }
      })
      console.log(`🚨 INCIDENT: ${websiteId} (${downRegions.length}/${regions.length} down)`)
    }

    // Resolve incident if back up
    if (!isDown && incident) {
      await prisma.incident.update({
        where: { id: incident.id },
        data: { endedAt: new Date(), status: "Resolved" }
      })
      console.log(`RESOLVED: ${websiteId}`)
    }

  } catch (error) {
    console.error(`Error checking ${websiteId}:`, error)
  }
}