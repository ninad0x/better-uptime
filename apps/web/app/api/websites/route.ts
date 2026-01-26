import { prisma } from "@repo/db/client"

export async function GET() {
    const websites = await prisma.website.findMany({
        where: { enabled: true }
    })

    return Response.json({ websites })
}
