"use server"


import {
    SendMailRequest, SendMailResponse,
} from "@/lib/types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function sendEmail(sendMailRequest: SendMailRequest): Promise<SendMailResponse> {
    const res = await fetch(`${baseUrl}/api/mail/send`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMailRequest)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return await res.json();
}