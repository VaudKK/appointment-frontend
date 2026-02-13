import {
    CreateServiceRequest, CreateServiceResponse,
    PaginatedResponse,
    Service,
    TimeSlot
} from "@/lib/types";

export async function getOrganizationServices(organizationId: string): Promise<PaginatedResponse<Service>> {

    console.log(organizationId)

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

    if (!res.ok) {
        throw new Error("Failed to create service");
    }

    return await res.json();
}
