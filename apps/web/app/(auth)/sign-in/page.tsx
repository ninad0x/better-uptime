"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/authClient"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInValues, signInSchema } from "@/lib/types"
import { useRouter } from "next/navigation"


export default function Page() {

  const router = useRouter()

  const form = useForm<signInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })
  
  const onSubmit = async (data: signInValues) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.log(error);
    } else {
      console.log("sign In success");
      router.push("/dashboard")
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({
      provider: provider,
      callbackURL: "http://localhost:3000/dashboard"
    })

    if (error) {
      console.log(error);
    } else {
      console.log("sign In success");
    }
  }

  async function handleSocialSignOut(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({
      provider: provider,
      callbackURL: "http://localhost:3000/dashboard"
    })

    if (error) {
      console.log(error);
    } else {
      console.log("sign In success");
    }
  }
   

  return (
    <div className="p-4 mt-30 max-w-100 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign in
          </Button>

        </form>
      </Form>

      <Button onClick={() => handleSocialSignIn("google")} className="mt-5">Google</Button>
    </div>
  )
}