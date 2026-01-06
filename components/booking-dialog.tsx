"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingForm } from "@/components/booking-form"
import {Service} from "@/lib/types";


interface BookingDialogProps {
    service: Service
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingDialog({ service, open, onOpenChange }: BookingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Book {service.name}</DialogTitle>
                    <DialogDescription>{service.location}</DialogDescription>
                </DialogHeader>
                <BookingForm service={service} onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
