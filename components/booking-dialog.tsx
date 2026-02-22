"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingForm } from "@/components/booking-form"
import {Service, TimeSlot} from "@/lib/types";


interface BookingDialogProps {
    service: Service
    timeSlot: TimeSlot
    open: boolean
    onOpenChange: (open: boolean) => void
    storeSlug?: string
}

export function BookingDialog({ service, timeSlot, open, onOpenChange, storeSlug }: BookingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Book {service.name}</DialogTitle>
                    <DialogDescription>{service.location}</DialogDescription>
                </DialogHeader>
                <BookingForm
                    service={service}
                    timeSlot={timeSlot}
                    onSuccess={() => onOpenChange(false)}
                    storeSlug={storeSlug}
                />
            </DialogContent>
        </Dialog>
    )
}
