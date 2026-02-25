import { enforceAdminAuthOrRedirect } from "@/lib/api/admin-auth-redirect";

export type MpesaCredentials = {
    consumerKey: string;
    consumerSecret: string;
    shortCode: string;
    initiatorName: string;
    initiatorPassword: string;
};

type MpesaCredentialsResponse = Partial<MpesaCredentials> & {
    ConsumerKey?: string;
    ConsumerSecret?: string;
    ShortCode?: string;
    InitiatorName?: string;
    InitiatorPassword?: string;
};

function normalizeCredentials(data: MpesaCredentialsResponse | null | undefined): MpesaCredentials {
    return {
        consumerKey: data?.consumerKey ?? data?.ConsumerKey ?? "",
        consumerSecret: data?.consumerSecret ?? data?.ConsumerSecret ?? "",
        shortCode: data?.shortCode ?? data?.ShortCode ?? "",
        initiatorName: data?.initiatorName ?? data?.InitiatorName ?? "",
        initiatorPassword: data?.initiatorPassword ?? data?.InitiatorPassword ?? "",
    };
}

export async function fetchMpesaCredentials(token: string): Promise<MpesaCredentials> {
    const res = await fetch("/api/admin/mps/credentials/fetch", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    enforceAdminAuthOrRedirect(res);

    if (res.status === 404) {
        return normalizeCredentials(null);
    }

    if (!res.ok) {
        throw new Error("Failed to load Mpesa credentials");
    }

    const data = (await res.json()) as MpesaCredentialsResponse;
    return normalizeCredentials(data);
}

export async function registerMpesaCredentials(
    token: string,
    organizationId: string,
    credentials: MpesaCredentials
): Promise<void> {
    const res = await fetch("/api/admin/mps/credentials/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            organizationId,
            ConsumerKey: credentials.consumerKey,
            ConsumerSecret: credentials.consumerSecret,
            ShortCode: credentials.shortCode,
            InitiatorName: credentials.initiatorName,
            InitiatorPassword: credentials.initiatorPassword,
        }),
    });

    enforceAdminAuthOrRedirect(res);

    if (!res.ok) {
        throw new Error("Failed to save Mpesa credentials");
    }
}
