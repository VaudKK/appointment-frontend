"use server"

import {NextRequest, NextResponse} from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: NextRequest,context: {params: Promise<{organizationId: string}>}){
    const { organizationId } = await context.params
    const searchParams = r.nextUrl.searchParams

    const page = searchParams.get("page");
    const size = searchParams.get("size");

    const res = await fetch(`${BACKEND_URL}/api/v1/appointments/organization?id=${organizationId}&page=${page}&size=${size}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await res.json()
    return NextResponse.json(data,{status: res.status})
}