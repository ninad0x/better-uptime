import { prisma } from "@repo/db/client"

interface IncidentCheckResult {
  incidentCreated: boolean
  incidentResolved: boolean
  message: string
}

export async function checkIncidentForWebsite(
  websiteId: string
): Promise<IncidentCheckResult> {
  
  // CONFIG
  const WINDOW_MS = 3 * 60 * 1000
  const MIN_REGIONS_REQUIRED = 2
  const DOWN_THRESHOLD = 2
  const DOWN_STATUS_CODE = 400
  
  const cutoff = new Date(Date.now() - WINDOW_MS)

  try {
    const ticks = await prisma.websiteTick.findMany({
      where: { 
        websiteId,
        createdAt: { gte: cutoff }
      },
      orderBy: { createdAt: "desc" },
      include: {
        region: { select: { name: true } }
      }
    })

    
    const latestByRegion = new Map<string, typeof ticks[0]>()
    for (const tick of ticks) {
      if (!latestByRegion.has(tick.regionId)) {
        latestByRegion.set(tick.regionId, tick)
      }
    }

    
    if (latestByRegion.size < MIN_REGIONS_REQUIRED) {
      return {
        incidentCreated: false,
        incidentResolved: false,
        message: `Insufficient data: only ${latestByRegion.size}/${MIN_REGIONS_REQUIRED} regions reporting`
      }
    }

    const regionStatus = Array.from(latestByRegion.entries()).map(([regionId, tick]) => ({
      regionId,
      regionName: tick.region.name,
      status: tick.status,
      isDown: tick.status >= DOWN_STATUS_CODE,
      latency: tick.responseTimeMs,
      timestamp: tick.createdAt
    }))

    const downRegions = regionStatus.filter(r => r.isDown)
    const totalRegions = regionStatus.length

    const activeIncident = await prisma.incident.findFirst({
      where: { 
        websiteId, 
        endedAt: null 
      },
      orderBy: { startedAt: 'desc' }
    })

    const isCurrentlyDown = downRegions.length >= DOWN_THRESHOLD

    if (isCurrentlyDown && !activeIncident) {
      const incidentType = downRegions.length === totalRegions ? "Global" : "Regional"
      const downRegionNames = downRegions.map(r => r.regionName).join(", ")
      
      await prisma.incident.create({
        data: {
          websiteId,
          type: incidentType,
          status: "Ongoing",
          startedAt: new Date(),
          cause: `${downRegions.length}/${totalRegions} regions down: [${downRegionNames}]`
        }
      })

      console.log(`🚨 INCIDENT CREATED - Website ${websiteId}: ${incidentType} outage (${downRegions.length}/${totalRegions} regions down)`)
      
      return {
        incidentCreated: true,
        incidentResolved: false,
        message: `Incident created: ${incidentType} outage`
      }
    }

    if (!isCurrentlyDown && activeIncident) {
      await prisma.incident.update({
        where: { id: activeIncident.id },
        data: { 
          endedAt: new Date(), 
          status: "Resolved"
        }
      })

      const duration = Date.now() - activeIncident.startedAt.getTime()
      const durationMin = Math.floor(duration / 60000)

      console.log(`✅ INCIDENT RESOLVED - Website ${websiteId}: Lasted ${durationMin} minutes`)
      
      return {
        incidentCreated: false,
        incidentResolved: true,
        message: `Incident resolved after ${durationMin} minutes`
      }
    }

    return {
      incidentCreated: false,
      incidentResolved: false,
      message: activeIncident 
        ? `Incident ongoing: ${downRegions.length}/${totalRegions} regions still down`
        : `Healthy: ${totalRegions - downRegions.length}/${totalRegions} regions up`
    }

  } catch (error) {
    console.error(`Error checking incident for website ${websiteId}:`, error)
    return {
      incidentCreated: false,
      incidentResolved: false,
      message: `Error during incident check: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}