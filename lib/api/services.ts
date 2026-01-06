import {PaginatedResponse, Service} from "@/lib/types";

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