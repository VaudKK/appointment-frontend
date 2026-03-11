import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(r: NextRequest) {
    const body = await r.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/mpesa/transaction-status-query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const responseText = await res.text();
    let data: unknown = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = { error: "Invalid response from payment service" };
        }
    }

    return NextResponse.json(data, { status: res.status });
}
