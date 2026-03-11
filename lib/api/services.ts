import {
    CreateServiceRequest, CreateServiceResponse,
    PaginatedResponse,
    Service,
    TimeSlot,
    UpdateServiceRequest
} from "@/lib/types";
import {enforceAdminAuthOrRedirect} from "@/lib/api/admin-auth-redirect";

export async function getOrganizationServices(organizationId: string): Promise<PaginatedResponse<Service>> {

    const res = await fetch(`/api/services/${organizationId}`,{
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
    const res = await fetch(`/api/store/${slug}/services`, {
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
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (q.trim().length > 0) {
        params.set("q", q.trim());
    }

    const res = await fetch(`/api/store/${slug}/services?${params.toString()}`, {
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

    const res = await fetch(`/api/services/slots/${serviceId}/${formattedDate}`,{
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
    const res = await fetch(`/api/admin/services/create`,{
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

    const res = await fetch(`/api/admin/services/update`, {
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
