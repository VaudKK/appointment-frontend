"use server"

import {NextRequest, NextResponse} from "next/server";
import {authorizeAdminRequest} from "@/lib/admin-auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: NextRequest){
    const authResult = await authorizeAdminRequest(r.headers)

    if (!authResult.authorized) {
        const status = authResult.reason === "forbidden" ? 403 : 401
        return NextResponse.json({ error: "Unauthorized" }, { status })
    }

    const searchParams = r.nextUrl.searchParams
    const slot = searchParams.get("slot")?.trim()
    const startDate = searchParams.get("startDate")?.trim()
    const endDate = searchParams.get("endDate")?.trim()
    const page = searchParams.get("page")?.trim()
    const size = searchParams.get("size")?.trim()

    const query = new URLSearchParams()

    if (slot) {
        query.set("slot", slot)
    }

    if (startDate) {
        query.set("startDate", startDate)
    }

    if (endDate) {
        query.set("endDate", endDate)
    }

    if (page) {
        query.set("page", page)
    }

    if (size) {
        query.set("size", size)
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/appointments/search?${query.toString()}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${r.headers.get("Authorization")}`
        }
    })

    const data = await res.json()
    return NextResponse.json(data,{status: res.status})
}
