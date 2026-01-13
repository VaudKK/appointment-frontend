export interface Service {
    id: string
    name: string
    imageUrl: string
    description: string
    duration: number // minutes
    location: string
    price: number
    organizationId: string
    available: boolean
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
}

export interface PaginatedResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
}

export interface CreateAppointmentRequest {
    serviceId: string
    userId: string | null
    notes: string
    organizationId: string
    slotId: string
}

export interface CreateAppointmentResponse{
    appointmentId: string
}

export interface TimeSlot {
    slotId: string
    startTime: string
    endTime: string
    bufferTime: number
    duration: number
    slotsAvailable: number
}