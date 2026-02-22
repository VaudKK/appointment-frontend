import {NextRequest, NextResponse} from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(r: NextRequest){
    const body = await r.json();

    const params = new URLSearchParams(r.url.split("?")[1]);
    const channel = params.get("channel");

    const res =  await fetch(`${BACKEND_URL}/api/v1/otp/send?channel=${channel}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })

    const data = await res.json()
    return NextResponse.json(data,{status: res.status})
}