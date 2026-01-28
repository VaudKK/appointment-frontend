"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {AlertCircle} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const formSchema = z.object({
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
    confirmPassword: z.string()
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

type ResetPasswordFormValues = z.infer<typeof formSchema>

export default function ResetPasswordForm() {
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          password: "",
          confirmPassword: "",
        },
      })

    const [isSubmitting,setIsSubmitting] = useState(false);
    const [tokenInvalid,setTokenInvalid] = useState(false);
    const [token,setToken] = useState("");
    const router = useRouter()

    useEffect(() => {
        const resetToken = new URLSearchParams(window.location.search).get("token");
        if (!resetToken) {
            setTokenInvalid(true);
            return;
        }else {
            setToken(resetToken);
        }
    }, []);

    if (tokenInvalid) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center max-w-md">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Invalid Reset Link</h1>
                        <p className="text-muted-foreground">
                            This password reset link has expired or is invalid. Please request a new one to reset your password.
                        </p>
                    </div>

                    <Link href="/admin/me/signin" className="w-full">
                        <Button className="w-full" size="lg">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }



    const handleResetPassword = async (values: ResetPasswordFormValues) => {

        const password = values.password;
        const confirmPassword = values.confirmPassword;

        if (password !== confirmPassword) {
            toast.error(() => "Passwords do not match")
            return;
        }

        try {

            const {error} = await authClient.resetPassword({
                newPassword: password,
                token
            })

            if (error) {
                toast.error(() => `${error.message}`)
                return;
            }

            toast.success("Password reset successful");
            router.push("/admin/me/signin")

        } catch (err) {
            toast.error(() => `Unexpected error during sign in: ${err}`)
        }finally {
            setIsSubmitting(false);
            form.reset();
        }
    };

    const onSubmit = async (values: ResetPasswordFormValues) => {
        setIsSubmitting(true)
        await handleResetPassword(values);
    };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
            Reset Your password
          </h3>
        </div>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}