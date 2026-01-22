import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@repo/db/client"

export const auth = betterAuth({

    database: prismaAdapter(prisma, { provider: "postgresql" }),
    
    baseURL: "http://localhost:3001",

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
        github: {
            clientId: "",
            clientSecret: ""
        }
    },

    trustedOrigins: ["http://localhost:3000"]
})