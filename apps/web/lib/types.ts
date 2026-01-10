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

export type signUpValues = z.infer<typeof signUpSchema>
export type signInValues = z.infer<typeof signInSchema>