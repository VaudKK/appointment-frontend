import { enforceAdminAuthOrRedirect } from "@/lib/api/admin-auth-redirect";

export async function uploadServiceImage(organizationId: string, file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append("organizationId", organizationId);
    formData.append("file", file);

    const res = await fetch("/api/admin/files/upload", {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    enforceAdminAuthOrRedirect(res);

    if (!res.ok) {
        throw new Error("Failed to upload service image");
    }

    const data = await res.json();
    return data.key;
}

export async function getSignedImageUrl(key: string): Promise<string> {
    const query = new URLSearchParams({ key }).toString();
    const res = await fetch(`/api/files/download?${query}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Failed to get image URL");
    }

    const data = await res.json();
    return data.url;
}
