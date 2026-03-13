"use server"


import { SendMailRequest, SendMailResponse } from "@/lib/types"
import { buildBackendUrl } from "@/lib/api/backend"


export async function sendEmail(sendMailRequest: SendMailRequest): Promise<SendMailResponse> {
    const endpoint = buildBackendUrl("/api/v1/mail/send")
    console.log("[mail] sendEmail endpoint:", endpoint)

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMailRequest)
    })

    const raw = await res.clone().text()
    console.log("[mail] backend raw response:", raw)

    if (!res.ok) {
        throw new Error("Failed to send email")
    }

    return await res.json()
}
