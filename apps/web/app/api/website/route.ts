import { prisma } from "@repo/db/client"

export async function POST(request: Request) {
    const body = await request.json()

    if (!body.url) {
        return Response.json({}, { status: 411 })
    }

    const website = await prisma.website.create({
        data: {
            name: body.name,
            url: body.url,
            userId: "NYkXGBr8tilpGPcwWn5ju8fZ94eYs6nd",
            currentStatus: 0
        }
    })

    return Response.json({ id: website.id })
}
