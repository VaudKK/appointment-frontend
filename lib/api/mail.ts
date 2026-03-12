"use server"


import {
    SendMailRequest, SendMailResponse,
} from "@/lib/types";


export async function sendEmail(sendMailRequest: SendMailRequest): Promise<SendMailResponse> {
    const res = await fetch(`/api/mail/send`,{
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