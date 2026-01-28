"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
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
import {useState} from "react";
import {useRouter} from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type ForgotPasswordFormValues = z.infer<typeof formSchema>

export default function ForgotPasswordForm() {
      const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
      })

    const router = useRouter()
    const [isSubmitting,setIsSubmitting] = useState(false);

    const handleSubmitResetLink = async (values: ForgotPasswordFormValues) => {

        const email = values.email;

        try {
            const {error} =  await authClient.requestPasswordReset({
                email,
                redirectTo: "/admin/me/reset-password"
            });

            if (error) {
                toast.error(() => `${error.message}`)
                return;
            }

            toast.success("Reset link sent to your email");
            router.replace("/admin/me/signin")

        } catch (err) {
            toast.error(() => `Unexpected error during sign in: ${err}`)
        }finally {
            setIsSubmitting(false);
            form.reset();
        }
    };

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        setIsSubmitting(true)
        await handleSubmitResetLink(values);
    };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
            Reset Your Password
          </h3>
        </div>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </Form>
          </CardContent>
            <p className="mt-6 text-center text-sm text-muted-foreground">
                Back to {" "}
                <Link
                    href="/admin/me/signin"
                    className="font-medium text-primary hover:underline"
                >
                    Sign In
                </Link>
            </p>
        </Card>
      </div>
    </div>
  )
}