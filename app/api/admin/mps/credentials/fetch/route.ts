import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: NextRequest) {
    const authResult = await authorizeAdminRequest(r.headers);
    if (!authResult.authorized) {
        const status = authResult.reason === "forbidden" ? 403 : 401;
        return NextResponse.json({ error: "Unauthorized" }, { status });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/organizations/mps/credentials/fetch`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${r.headers.get("Authorization")}`,
        },
    });

    if (res.status === 204) {
        return NextResponse.json({}, { status: 200 });
    }

    const responseText = await res.text();

    let data: unknown = {};
    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = {};
        }
    }
    return NextResponse.json(data, { status: res.status });
}
