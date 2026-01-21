import { prisma } from "store/client"

export async function checkIncidentForWebsite(websiteId: string) {
  const WINDOW_MS = 1.5 * 60 * 1000
  const now = Date.now()

  // latest ticks for website
  const ticks = await prisma.websiteTick.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" },
    take: 10
  })

  // latest per region
  const latest = new Map<string, typeof ticks[0]>()
  for (const t of ticks) {
    if (!latest.has(t.regionId)) latest.set(t.regionId, t)
  }

  let down = 0
  let fresh = 0

  for (const tick of latest.values()) {
    if (now - tick.createdAt.getTime() <= WINDOW_MS) {
      fresh++
      if (tick.status === "Down") {
        down++
      }
    }
  }

  // need at least 2 fresh regions to decide
  if (fresh < 2) return

  const active = await prisma.incident.findFirst({
    where: { websiteId, endedAt: null }
  })

  if (down >= 2) {
    if (!active) {
      await prisma.incident.create({
        data: {
          websiteId,
          type: down === fresh ? "Global" : "Regional",
          status: "Ongoing",
          startedAt: new Date(),
          cause: `${down} regions down`
        }
      })
      console.log("INCIDENT created")
    }
  } else {
    if (active) {
      await prisma.incident.update({
        where: { id: active.id },
        data: { endedAt: new Date(), status: "Resolved" }
      })
      console.log("INCIDENT resolved")
    }
  }
}
