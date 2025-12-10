import { createClient } from "redis"

type WebsiteEvent = { url: string, id: string }

const client = await createClient()
    .on("error", (err) => console.log("ERR ", err))
    .connect();


async function xADD({url, id}: WebsiteEvent) {
    await client.xAdd(
        "betteruptime:website", "*", {
            url: url,
            id: id
        }
    )
}

export async function xADDBulk(websites: WebsiteEvent[]) {

    websites.forEach(async (w) => {
        await xADD({
            url: w.url,
            id: w.id
        })
    })
}