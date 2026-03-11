import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(r: NextRequest) {
    const authResult = await authorizeAdminRequest(r.headers);
    if (!authResult.authorized) {
        const status = authResult.reason === "forbidden" ? 403 : 401;
        return NextResponse.json({ error: "Unauthorized" }, { status });
    }

    const body = await r.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/services/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${r.headers.get("Authorization")}`
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
