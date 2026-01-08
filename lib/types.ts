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
    appointmentTime: string
    notes: string
    organizationId: string
}

export interface CreateAppointmentResponse{
    appointmentId: string
}