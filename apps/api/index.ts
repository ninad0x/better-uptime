import jwt from "jsonwebtoken";
import express from "express"
import { prisma } from "store/client"
import { AuthInput, WebsiteTickBatch } from "./types";
import { authMiddleware } from "./lib/authMiddleware";
import { WebsiteStatus } from "../../packages/store/generated/prisma/enums";
// import "./cron/aggregator"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { getServerSession } from "./lib/getSession";
import "./cron/new-cron"


const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))


app.get("/", (req, res) => {
    return res.json({message: "hellows"})
})

app.all("/api/auth/*splat", toNodeHandler(auth))


app.get("/api/profile", async (req, res) => {
    const session = await getServerSession(req)

    if (!session) {
        return res.status(401).send("Unauthorized")
    }

    res.json(session)
})


app.use(express.json())


// app.post("/user/signup", async (req, res) => {
//     try {

//         const data = AuthInput.safeParse(req.body)

//         if (!data.success) {
//             return res.status(403).send("")
//         }

//         const user = await prisma.user.create({
//             data: {
//                 name: data.data.username,
//                 password: data.data.password
//             }
//         })

//         return res.json({
//             id: user.id
//         })

//     } catch (error) {
//         return res.status(403).send("")
//     }
// })


// app.post("/user/signin", async (req, res) => {
//     try {
//         const data = AuthInput.safeParse(req.body)

//         if (!data.success) {
//             return res.status(403).send("not")
//         }

//         let user = await prisma.users.findFirst({
//             where: {
//                 username: data.data.username,
//             }
//         })

//         if (!user) {
//             return res.json({
//                 message: "User does not exist"
//             })
//         }

//         if (user.password !== data.data.password) {
//             return res.json({
//                 message: "Incorrect password"
//             })
//         }

//         const token = jwt.sign(user.id, process.env.JWT_SECRET!)

//         res.json({
//             jwt: token
//         })


//     } catch (error) {
//         return res.status(403).send("err")
//     }
// })


app.get("/websites", async (req, res) => {

    const websites = await prisma.website.findMany();

    return res.json({
        websites
    })
})


app.post("/website", async (req, res) => {
    
    if (!req.body.url) {
        res.status(411).json({});
        return
    }
    
    const website = await prisma.website.create({
        data: {
            name: req.body.name,
            url: req.body.url,
            // userId: req.userId!
            userId: "1K19HYSNIu8YaCXMoEw20AwkQf7jvgMj"
        }
    })

    return res.json({
        id: website.id
    })
})


app.post("/region", async (req, res) => {
    
    if (!req.body.region) {
        res.status(411).json({});
        return
    }
    
    const region = await prisma.region.create({
        data: {
            name: req.body.region
        }
    })

    return res.json({
        id: region.id,
        name: region.name
    })
})


app.get("/status/:websiteId", authMiddleware, async (req, res) => {

    try {

        const websiteTicks = await prisma.websiteTick.findMany({
            where: {
                websiteId : req.params.websiteId!
            },
            select: {
                status: true,
                responseTimeMs: true,
                region: { select: { name: true }},
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
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
            responseTimeMs: r.latency ?? -1,
            createdAt: new Date(r.timestamp),
            regionId: region!.id,
            websiteId: r.id,
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


app.get("/all", async (req, res) => {

    const ticks =  await prisma.websiteTick.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            website: { select: {url: true}},
            createdAt: true,
            status: true
        },
    })

    const ticksData = ticks.map((e) => ({
        id: e.id,
        url: e.website.url,
        status: e.status,
        createdAt: e.createdAt.toLocaleTimeString()
    }))

    return res.json({
        ticksData
    })
})


app.get("/all-metrics", async (req, res) => {

    const ticks =  await prisma.websiteMetric.findMany({
    })

    const ticksData = ticks.map((e) => ({
        id: e.websiteId,
        start: e.windowStart.toLocaleTimeString(),
        end: e.windowEnd.toLocaleTimeString()
    }))

    return res.json({
        ticksData
    })
})

app.listen(process.env.PORT || 3001, () => console.log("\nSERVER started", new Date().toLocaleTimeString()))