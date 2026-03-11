import { NextRequest, NextResponse } from "next/server";
import { downloadFile } from "@/lib/files";

export async function GET(r: NextRequest) {
    const key = r.nextUrl.searchParams.get("key");
    if (!key) {
        return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const url = await downloadFile(key);
    return NextResponse.json({ url }, { status: 200 });
}
