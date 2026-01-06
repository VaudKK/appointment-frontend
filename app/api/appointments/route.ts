"use server"

import {NextResponse} from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: Request){
    const res = await fetch(`${BACKEND_URL}/api/v1/contributions`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await res.json()
    return NextResponse.json(data,{status: res.status})
}