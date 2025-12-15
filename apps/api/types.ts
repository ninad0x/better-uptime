import { z } from "zod";

export const AuthInput = z.object({
    username: z.string(),
    password: z.string()
})

const WebsiteTickSchema = z.object({
    id: z.string(),
    website: z.string(),
    status: z.string(),
    latency: z.number().nullable(),
    timestamp: z.number()
})

export type WebsiteTickType = z.infer<typeof WebsiteTickSchema>

export const WebsiteTickBatch = z.object({
    region: z.string(),
    results: z.array(WebsiteTickSchema)
})