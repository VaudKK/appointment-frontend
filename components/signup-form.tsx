"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import OtpForm from "@/components/otp-form";


const formSchema = z.object({
  username: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(100, {
      message: "Username must not be longer than 100 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must include at least one number.",
    }),
})

type SignupFormValues = z.infer<typeof formSchema>



export default function SignupForm() {

  const router = useRouter()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [formData,setFormData] = useState<SignupFormValues>({
        email: "",
        password: "",
        username: "",
    })

    const handleSignUp = async (values: SignupFormValues) => {

        const email = values.email;
        const password = values.password;
        const name = values.username;

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                name,
                password,
                callbackURL: "/admin/me/signin",
            }, {
                //callbacks
            })

            if (error) {
                toast.error(() => `${error.message}`)
                return;
            }

            toast.success("Sign in successful");
            router.push("/admin/me/signin");

        } catch (err) {
            toast.error(() => `Unexpected error during sign in: ${err}`)
        }finally {
            setIsSubmitting(false);
            form.reset();
        }
    };


  const onSubmit = async (values: SignupFormValues) => {
      setFormData(values)
      setShowOtp(true)
  }

  const handleOnOtpVerified = async () => {
      setShowOtp(false)
      setIsSubmitting(true)
      await handleSignUp(formData)
  }

  if(showOtp) {
    return <OtpForm subject={form.getValues().email} onOtpVerified={handleOnOtpVerified}/>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex-1 px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-2xl font-bold text-foreground">
            Create an account
          </h2>
        </div>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" type="email" {...field} />
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
                        <Input placeholder={"password"} type="password" {...field} />
                      </FormControl>
                    <div className="text-xs text-muted-foreground mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and a number
                    </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/admin/me/signin"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground px-4 mt-5">
          By signing up, you agree to our{" "}
          <Link
            href="#"
            className="text-primary hover:underline"
          >
            Terms of use
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-primary hover:underline"
          >
            Privacy policy
          </Link>
        </p>
      </div>
    </div>
  )
}