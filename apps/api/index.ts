import express from "express"
import { prisma } from "store/client"

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    return res.json({})
})


app.post("/website", async (req, res) => {

    const websites = await prisma.website.findMany()

    return res.json({
        websites
    })
})


app.listen(3001)