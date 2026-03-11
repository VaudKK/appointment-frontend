import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import uploadFile from "@/lib/files";

export async function POST(r: NextRequest) {
    const authResult = await authorizeAdminRequest(r.headers);
    if (!authResult.authorized) {
        const status = authResult.reason === "forbidden" ? 403 : 401;
        return NextResponse.json({ error: "Unauthorized" }, { status });
    }

    const formData = await r.formData();
    const organizationId = formData.get("organizationId");
    const file = formData.get("file");

    if (typeof organizationId !== "string" || !organizationId) {
        return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const key = await uploadFile(organizationId, file);
    return NextResponse.json({ key }, { status: 200 });
}
