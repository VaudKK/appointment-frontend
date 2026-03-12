"use server"


import { SendMailRequest, SendMailResponse } from "@/lib/types"

const getBaseUrl = () => {
    const explicitBaseUrl =
        process.env.NEXT_INTERNAL_APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.BETTER_AUTH_URL ||
        (process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : undefined) ||
        (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : undefined) ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

    return (explicitBaseUrl ?? "http://localhost:3000").replace(/\/$/, "")
}


export async function sendEmail(sendMailRequest: SendMailRequest): Promise<SendMailResponse> {
    const res = await fetch(`${getBaseUrl()}/api/mail/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMailRequest)
    })

    if (!res.ok) {
        throw new Error("Failed to send email")
    }

    return await res.json()
}
