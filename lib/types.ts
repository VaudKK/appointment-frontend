export interface Service {
    id: string
    name: string
    imageUrl: string
    description: string
    duration: number // minutes
    location: string
    price: number
    organizationId: string
    days: string[]
    slotsPerTimeDuration: number
    bufferTime: number
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
    customerName: string
    serviceId: string
    userId: string | null
    notes: string
    organizationId: string
    slotId: string
}

export interface CreateAppointmentResponse{
    appointmentId: string
}

export interface CreateServiceResponse{
    serviceId: string
}

export interface TimeSlot {
    slotId: string
    startTime: string
    endTime: string
    bufferTime: number
    duration: number
    slotsAvailable: number
}

export interface Appointment {
    id: string;
    userId: number;
    customerName: string;
    serviceId: string;
    appointmentTime: string;
    status: "Scheduled" | "Cancelled";
    rescheduleCount: number;
    reschedulable: boolean;
    accepted: boolean;
    notes?: string;
    organizationId: string;
    slotId: string;
    createdAt: string;
    updatedAt: string;
}

import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const serviceFormSchema = z.object({
    name: z.string().min(1, "Service name is required").min(3, "Name must be at least 3 characters"),
    description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
    imageUrl: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Image must be less than 5MB",
    }),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    bufferTime: z.coerce.number().min(0, "Buffer time cannot be negative").optional().default(0),
    slotsPerTimeDuration: z.coerce.number().min(1, "Must have at least 1 slot"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    location: z.string().min(1, "Location is required"),
    days: z.array(z.string()).min(1, "Select at least one day"),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>

export interface CreateServiceRequest {
    name: string;
    imageUrl: string;
    description: string;
    days: string[];
    bufferTime: number;
    slotsPerTimeDuration: number;
    duration: number;
    locations: string;
    price: number;
    organizationId: string;
}