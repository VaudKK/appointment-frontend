"use server"


import { SendMailRequest, SendMailResponse } from "@/lib/types"


export async function sendEmail(sendMailRequest: SendMailRequest): Promise<SendMailResponse> {
    const baseUrl = process.env.BETTER_AUTH_URL || process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL
    if (!baseUrl) {
        throw new Error("Missing base URL for mail API (BETTER_AUTH_URL or BASE_URL or NEXT_PUBLIC_APP_URL).")
    }

    const res = await fetch(new URL("/api/mail/send", baseUrl), {
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
