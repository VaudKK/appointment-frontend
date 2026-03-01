"use server"

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const ORGANIZATION_SLUG_RESOLVE_PATH =
    process.env.ORGANIZATION_SLUG_RESOLVE_PATH ?? "/api/v1/organizations/resolve";

function looksLikeOrganizationId(slug: string): boolean {
    return /^[0-9a-fA-F-]{32,36}$/.test(slug);
}

async function resolveOrganizationId(slug: string): Promise<string | null> {
    if (!BACKEND_URL) {
        return null;
    }

    const resolveUrl = `${BACKEND_URL}${ORGANIZATION_SLUG_RESOLVE_PATH}?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(resolveUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    const organizationId = data?.organizationId ?? data?.id ?? null;
    return typeof organizationId === "string" ? organizationId : null;
}

export async function GET(r: Request, context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params;
    const requestUrl = new URL(r.url);
    const q = requestUrl.searchParams.get("q")?.trim() ?? "";
    const page = requestUrl.searchParams.get("page")?.trim();
    const size = requestUrl.searchParams.get("size")?.trim();

    const resolvedOrganizationId = await resolveOrganizationId(slug);
    const organizationId = resolvedOrganizationId ?? (looksLikeOrganizationId(slug) ? slug : null);

    if (!organizationId) {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const query = new URLSearchParams();
    query.set("id", organizationId);

    if (page) {
        query.set("page", page);
    }

    if (size) {
        query.set("size", size);
    }

    if (q.length > 0) {
        query.set("q", q);
    }

    const apiPath = q.length > 0 ? "/api/v1/services/search" : "/api/v1/services/organization";
    const res = await fetch(`${BACKEND_URL}${apiPath}?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
