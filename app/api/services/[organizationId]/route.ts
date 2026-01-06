"use server"

import {NextResponse} from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: Request,context: {params: Promise<{organizationId: string}>}){
    const { organizationId } = await context.params

    const res = await fetch(`${BACKEND_URL}/api/v1/services/organization?id=${organizationId}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await res.json()
    return NextResponse.json(data,{status: res.status})
}