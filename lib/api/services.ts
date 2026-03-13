import {
    CreateServiceRequest, CreateServiceResponse,
    PaginatedResponse,
    Service,
    TimeSlot,
    UpdateServiceRequest
} from "@/lib/types";
import {enforceAdminAuthOrRedirect} from "@/lib/api/admin-auth-redirect";
import { buildBackendUrl, getOrganizationResolvePath } from "@/lib/api/backend";

function looksLikeOrganizationId(slug: string): boolean {
    return /^[0-9a-fA-F-]{32,36}$/.test(slug);
}

async function resolveOrganizationId(slug: string): Promise<string | null> {
    if (looksLikeOrganizationId(slug)) {
        return slug;
    }

    const resolveUrl = buildBackendUrl(getOrganizationResolvePath(), { slug });
    const res = await fetch(resolveUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json().catch(() => ({}));
    const organizationId = data?.organizationId ?? data?.id ?? null;
    return typeof organizationId === "string" ? organizationId : null;
}

export async function getOrganizationServices(organizationId: string): Promise<PaginatedResponse<Service>> {

    const res = await fetch(buildBackendUrl("/api/v1/services/organization", { id: organizationId }),{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return await res.json();
}

export async function getStoreServicesBySlug(slug: string): Promise<PaginatedResponse<Service>> {
    const organizationId = await resolveOrganizationId(slug);

    if (!organizationId) {
        throw new Error("Store not found");
    }

    const res = await fetch(buildBackendUrl("/api/v1/services/organization", { id: organizationId }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return await res.json();
}

export async function searchStoreServicesBySlug(
    slug: string,
    q: string,
    page: number,
    size: number
): Promise<PaginatedResponse<Service>> {
    const organizationId = await resolveOrganizationId(slug);

    if (!organizationId) {
        throw new Error("Store not found");
    }

    const params: Record<string, string> = {
        id: organizationId,
        page: page.toString(),
        size: size.toString(),
    };

    if (q.trim().length > 0) {
        params.q = q.trim();
    }

    const apiPath = q.trim().length > 0 ? "/api/v1/services/search" : "/api/v1/services/organization";
    const res = await fetch(buildBackendUrl(apiPath, params), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return await res.json();
}

export async function getAvailableSlots(serviceId: string, dateSelected: Date): Promise<TimeSlot[]> {
    const formattedDate = new Date(dateSelected).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Africa/Nairobi'
    }).replace(/\//g, '-');

    const res = await fetch(buildBackendUrl("/api/v1/services/slots", {
        service_id: serviceId,
        date: formattedDate,
    }),{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch slots");
    }

    return await res.json();
}

export async function createService(newService: CreateServiceRequest,token: string): Promise<CreateServiceResponse> {
    const res = await fetch(buildBackendUrl("/api/v1/services/create"),{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newService)
    });

    enforceAdminAuthOrRedirect(res)

    if (!res.ok) {
        throw new Error("Failed to create service");
    }

    return await res.json();
}

export async function updateService(service: UpdateServiceRequest, token: string): Promise<CreateServiceResponse> {

    const res = await fetch(buildBackendUrl("/api/v1/services/update"), {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(service)
    });

    enforceAdminAuthOrRedirect(res)

    if (!res.ok) {
        throw new Error("Failed to update service");
    }

    return await res.json();
}
