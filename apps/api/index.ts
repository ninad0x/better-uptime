import jwt from "jsonwebtoken";
import express, { response } from "express"
import { prisma } from "store/client"
import { AuthInput, WebsiteTick } from "./types";
import { authMiddleware } from "./authMiddleware";
import type { WebsiteStatus } from "../../packages/store/generated/prisma/enums";


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

const mapStatus = (s: string) => {
    if (s === "UP") return "Up";
    if (s === "DOWN") return "Down";
    return "Unknown";
};


app.post("/uptime", async (req, res) => {
    console.log("/uptime hit");

    const { success, data, error } = WebsiteTick.safeParse(req.body)

    if (!success) {
        return
    }

    for (const r of data.results) {
        
        const website = await prisma.website.findFirst({
            where: {
                url: r.url
            },
            select: {
                id: true
            }
        })

        const region = await prisma.region.findFirst({
            where: {
                name: data.region
            }
        })


        const tick = await prisma.websiteTick.create({
            data: {
                status: mapStatus(r.status),
                response_time_ms: r.latency ?? -1,
                created_at: new Date(r.timestamp),
                region: {
                    connect: { id: region!.id }
                },
                website: {
                    connect: { id: website!.id }
                }

            }
        });

        console.log("tick ", tick);
    }


    res.json({ ok: true });
});


app.listen(process.env.PORT || 3001)