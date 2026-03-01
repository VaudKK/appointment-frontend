import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(r: NextRequest) {
    const trx = r.nextUrl.searchParams.get("trx")?.trim();

    if (!trx) {
        return NextResponse.json({ error: "Missing trx query parameter" }, { status: 400 });
    }

    const query = new URLSearchParams({ trx });
    const res = await fetch(`${BACKEND_URL}/api/v1/mpesa/check-payment?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseText = await res.text();
    let data: unknown = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = { success: false };
        }
    }

    return NextResponse.json(data, { status: res.status });
}
