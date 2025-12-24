import jwt from "jsonwebtoken";
import express from "express"
import { prisma } from "store/client"
import { AuthInput, WebsiteTickBatch } from "./types";
import { authMiddleware } from "./authMiddleware";
import { WebsiteStatus } from "../../packages/store/generated/prisma/enums";
import "./cron/aggregator"


const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    return res.json({message: "hellows"})
})


app.post("/user/signup", async (req, res) => {
    try {

        const data = AuthInput.safeParse(req.body)

        if (!data.success) {
            return res.status(403).send("")
        }

        const user = await prisma.users.create({
            data: {
                username: data.data.username,
                password: data.data.password
            }
        })

        return res.json({
            id: user.id
        })

    } catch (error) {
        return res.status(403).send("")
    }
})


app.post("/user/signin", async (req, res) => {
    try {
        const data = AuthInput.safeParse(req.body)

        if (!data.success) {
            return res.status(403).send("not")
        }

        let user = await prisma.users.findFirst({
            where: {
                username: data.data.username,
            }
        })

        if (!user) {
            return res.json({
                message: "User does not exist"
            })
        }

        if (user.password !== data.data.password) {
            return res.json({
                message: "Incorrect password"
            })
        }

        const token = jwt.sign(user.id, process.env.JWT_SECRET!)

        res.json({
            jwt: token
        })


    } catch (error) {
        return res.status(403).send("err")
    }
})


app.get("/websites", async (req, res) => {

    const websites = await prisma.website.findMany();

    return res.json({
        websites
    })
})


app.post("/website", authMiddleware, async (req, res) => {
    
    if (!req.body.url) {
        res.status(411).json({});
        return
    }
    
    const website = await prisma.website.create({
        data: {
            url: req.body.url,
            timeAdded: new Date(),
            user_id: req.userId!
        }
    })

    return res.json({
        id: website.id
    })
})


app.get("/status/:websiteId", authMiddleware, async (req, res) => {

    try {

        const websiteTicks = await prisma.websiteTick.findMany({
            where: {
                website_id: req.params.websiteId!
            },
            select: {
                status: true,
                response_time_ms: true,
                region: { select: { name: true }},
                created_at: true
            },
            orderBy: {
                created_at: "desc"
            }
        })

        if (!websiteTicks) {
            return res.status(409).json({
                message: "Not found!"
            })
        }


        res.json({
            websiteTicks
        })
        
    } catch (error) {
        res.status(403).json({
            message: "Error"
        })
    }

})

function mapStatus(s: string) {
    if (s === "Up") return WebsiteStatus.Up;
    if (s === "Down") return WebsiteStatus.Down;
    return WebsiteStatus.Unknown;
}

app.post("/uptime", async (req, res) => {

    const { success, data, error } = WebsiteTickBatch.safeParse(req.body)

    if (!success) {
        console.log(error);
        return
    }

    try {
        const region = await prisma.region.findFirst({
            where: { name: data.region },
            select: { id: true, name: true }
        })

        // console.log("/uptime hit by region", region?.name);

        const ticks = data.results.map((r) => ({
            status: mapStatus(r.status),
            response_time_ms: r.latency ?? -1,
            created_at: new Date(r.timestamp),
            region_id: region!.id,
            website_id: r.id,
        }));

        try {

            const batch = await prisma.websiteTick.createMany({ data: ticks });
            console.log(`inserted: ${batch.count} from ${region?.name} at ${new Date().toLocaleTimeString()}`);
            
        } catch (e) {
            console.error("DB error:", e);
        }


    } catch (error) {
        return res.status(403).json({
            message: "Error creating ticks"
        })
    }

    res.json({ success: true });
});


app.listen(process.env.PORT || 3001)