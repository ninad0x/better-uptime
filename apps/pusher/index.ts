import { prisma } from "store/client"
import { xADDBulk } from "redis-stream/client"

async function main() {
    const websites = await prisma.website.findMany({
        select: {
            id: true,
            url: true
        }
    })
    
    await xADDBulk(websites)
    console.log(websites.length);
}

setInterval(() => {
    main()
}, 3 * 1000)

main()