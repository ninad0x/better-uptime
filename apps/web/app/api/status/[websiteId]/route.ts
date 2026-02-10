import { prisma } from "@repo/db/client"

export async function GET(
    _req: Request,
    { params }: { params: { websiteId: string } }) {
    
    const websiteTicks = await prisma.websiteTick.findMany({
        where: { websiteId: params.websiteId },
        select: {
            status: true,
            responseTimeMs: true,
            region: { select: { name: true } },
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    })

    if (!websiteTicks) {
        return Response.json({ message: "Not found!" }, { status: 409 })
    }

    return Response.json({ websiteTicks })
}
