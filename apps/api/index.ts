import jwt from "jsonwebtoken";
import express from "express"
import { prisma } from "store/client"
import "dotenv/config";
import { AuthInput } from "./types";


const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    return res.json({})
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

// app.post("/website", async (req, res) => {
    
//     const website = await prisma.website.create({
//         data: {
            
//         }
//     })

//     return res.json({
//         id: website.id
//     })
// })


app.listen(3001)