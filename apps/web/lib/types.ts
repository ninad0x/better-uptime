import z from "zod";

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    name: z.string()
})

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
})

const WebsiteTickSchema = z.object({
    id: z.string(),
    website: z.string(),
    status: z.number(),
    latency: z.number().nullable(),
    timestamp: z.number(),
    details: z.string()
})

export const WebsiteTickBatch = z.object({
    region: z.string(),
    results: z.array(WebsiteTickSchema)
})

export type signUpValues = z.infer<typeof signUpSchema>
export type signInValues = z.infer<typeof signInSchema>
export type WebsiteTickType = z.infer<typeof WebsiteTickSchema>


