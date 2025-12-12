import { z } from "zod";
import { WebsiteStatus } from "../../packages/store/generated/prisma/enums";

export const AuthInput = z.object({
    username: z.string(),
    password: z.string()
})

export const WebsiteTick = z.object({
    region: z.string(),
    results: z.array(
        z.object({
            url: z.string(),
            status: z.string(),
            latency: z.number().nullable(),
            timestamp: z.number()
        }
    ))
})