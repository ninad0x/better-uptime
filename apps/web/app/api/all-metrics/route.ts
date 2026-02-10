import { prisma } from "@repo/db/client"

export async function GET() {
  
  const ticks = await prisma.websiteMetric.findMany()

  const ticksData = ticks.map(e => ({
    id: e.websiteId,
    start: e.windowStart.toLocaleTimeString(),
    end: e.windowEnd.toLocaleTimeString()
  }))

  return Response.json({ ticksData })
}
