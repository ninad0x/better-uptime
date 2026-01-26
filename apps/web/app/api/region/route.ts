import { prisma } from "@repo/db/client"

export async function POST(request: Request) {
    
    const body = await request.json()

    if (!body.region) {
        return Response.json({}, { status: 411 })
    }

    const region = await prisma.region.create({
        data: { 
            name: body.region
        }
    })

    return Response.json({
        id: region.id, name: region.name
    })
}
