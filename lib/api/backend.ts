const DEFAULT_ORG_RESOLVE_PATH = "/api/v1/organizations/resolve";

function getBackendBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL;
    if (!baseUrl) {
        throw new Error("Backend URL is not configured. Set NEXT_PUBLIC_BACKEND_URL.");
    }
    return baseUrl;
}

export function buildBackendUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, getBackendBaseUrl());

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && String(value).length > 0) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url.toString();
}

export function getOrganizationResolvePath(): string {
    return process.env.NEXT_PUBLIC_ORGANIZATION_SLUG_RESOLVE_PATH
        ?? process.env.ORGANIZATION_SLUG_RESOLVE_PATH
        ?? DEFAULT_ORG_RESOLVE_PATH;
}
