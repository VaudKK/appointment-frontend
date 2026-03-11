import {
    Appointment,
    CreateAppointmentRequest,
    CreateAppointmentResponse,
    PaginatedResponse,
} from "@/lib/types";
import {enforceAdminAuthOrRedirect} from "@/lib/api/admin-auth-redirect";

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

export interface MpesaTransactionStatusQueryRequest {
    organizationId: string
    transactionid: string
    amount: number
}

export interface MpesaTransactionStatusQueryResponse {
    OriginatorConversationID?: string
    ConversationID?: string
    ResponseCode?: string
    ResponseDescription?: string
}

export async function queryMpesaTransactionStatus(
    payload: MpesaTransactionStatusQueryRequest
): Promise<MpesaTransactionStatusQueryResponse> {
    const res = await fetch(`/api/mpesa/transaction-status-query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        const errorMessage = typeof data?.error === "string" ? data.error : "Failed to query transaction status"
        throw new Error(errorMessage)
    }

    return data
}

export async function checkMpesaPayment(transactionId: string): Promise<{ success: boolean }> {
    const query = new URLSearchParams({ trx: transactionId })
    const res = await fetch(`/api/mpesa/check-payment?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        const errorMessage = typeof data?.error === "string" ? data.error : "Failed to check payment"
        throw new Error(errorMessage)
    }

    return { success: Boolean(data?.success) }
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

    enforceAdminAuthOrRedirect(res)

    if (!res.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await res.json();
}

interface SearchOrganizationBookingsParams {
    slot?: string
    startDate?: string
    endDate?: string
    page: number
    size: number
}

export async function searchOrganizationBookings(
    token: string,
    params: SearchOrganizationBookingsParams
): Promise<PaginatedResponse<Appointment>> {
    const query = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    })

    if (params.slot?.trim()) {
        query.set("slot", params.slot.trim())
    }

    if (params.startDate?.trim()) {
        query.set("startDate", params.startDate.trim())
    }

    if (params.endDate?.trim()) {
        query.set("endDate", params.endDate.trim())
    }

    const res = await fetch(`/api/admin/bookings/search?${query.toString()}`,{
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    enforceAdminAuthOrRedirect(res)

    if (!res.ok) {
        throw new Error("Failed to search bookings");
    }

    return await res.json();
}

export async function cancelBooking(token: string, bookingId: string): Promise<void> {
    const res = await fetch(`/api/admin/bookings/cancel`,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "appointmentId": bookingId
        })
    });

    enforceAdminAuthOrRedirect(res)

    if (!res.ok) {
        throw new Error("Failed to cancel booking");
    }

    await res.json();
}
