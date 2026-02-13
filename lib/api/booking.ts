import {
    Appointment,
    CreateAppointmentRequest,
    CreateAppointmentResponse,
    PaginatedResponse,
} from "@/lib/types";

export async function createBooking(booking: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const res = await fetch(`/api/appointments/create`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(booking)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return await res.json();
}

export async function sendOTP(phoneNumber: string,channel: string): Promise<{sessionId: string}>{
    const res = await fetch(`/api/otp/send?channel=${channel}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({subject: phoneNumber})
    });

    if (!res.ok) {
        const errorResponse = await res.json()
        console.log(errorResponse)
        throw new Error("Failed to send otp");
    }

    return await res.json();
}

export async function verifyOTP(sessionId: string, otp: string): Promise<{success: boolean}>{
    const res = await fetch(`/api/otp/verify`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({sessionId: sessionId, otp: otp})
    });

    if (!res.ok) {
        const errorResponse = await res.json()
        console.log(errorResponse)
        throw new Error(errorResponse.error);
    }

    return await res.json();
}

export async function getOrganizationBookings(token: string,page: number, size: number): Promise<PaginatedResponse<Appointment>> {
    const res = await fetch(`/api/admin/bookings?page=${page}&size=${size}`,{
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await res.json();
}
