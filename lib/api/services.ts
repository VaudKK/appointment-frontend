"use server"

import {PaginatedResponse, Service, TimeSlot} from "@/lib/types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function getOrganizationServices(organizationId: string): Promise<PaginatedResponse<Service>> {
    const res = await fetch(`${baseUrl}/api/services/${organizationId}`,{
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

    const res = await fetch(`${baseUrl}/api/services/slots/${serviceId}/${formattedDate}`,{
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