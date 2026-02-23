"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { OTPVerification } from "@/components/otp-verification"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {CreateAppointmentRequest, Service, TimeSlot} from "@/lib/types";
import {useMutation} from "@tanstack/react-query";
import {createBooking} from "@/lib/api/booking";
import TextAreaWithCount from "@/components/text-area-with-count";


interface BookingFormProps {
    service: Service
    timeSlot: TimeSlot
    onSuccess?: () => void
    storeSlug?: string
}

const bookingSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z.string().regex(/^(\+254|0)[0-9]{9}$/, "Please enter a valid Kenyan phone number (e.g., 0712345678)"),
    notes: z.string()
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function BookingForm({ service,timeSlot, storeSlug }: BookingFormProps) {
    const [showOTP, setShowOTP] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            notes: "",
        },
    })

    const bookingMutation = useMutation({
        mutationFn: (req: CreateAppointmentRequest) => createBooking(req),
        onSuccess: () => {
            setBookingSuccess(true)
            setIsSubmitting(false)
        },
        onError: () => {
            setBookingSuccess(false)
            setIsSubmitting(false)
        }
    })

    const addBooking = (booking: BookingFormValues) => {
        const bookingRequest: CreateAppointmentRequest = {
            customerName: booking.fullName,
            serviceId: service.id,
            notes: booking.notes,
            userId: null,
            organizationId: service.organizationId,
            slotId: timeSlot.slotId,
            phoneNumber: phoneNumber
        }
        bookingMutation.mutate(bookingRequest)
    }


    const onSubmit = async (values: BookingFormValues) => {
        setIsSubmitting(true)
        setPhoneNumber(values.phoneNumber)
        setShowOTP(true)
    }

    const handleOTPVerified = () => {
        setShowOTP(false)
        addBooking(form.getValues())
    }

    if (bookingSuccess) {
        return (
            <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground mb-6">
                    Your appointment has been successfully booked. You will receive a confirmation SMS shortly.
                </p>
                <div className="bg-muted p-4 rounded-lg text-left mb-6">
                    <p className="text-sm mb-2">
                        <span className="font-semibold">Service:</span> {service.name}
                    </p>
                    <p className="text-sm mb-2">
                        <span className="font-semibold">Location:</span> {service.location}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Total Amount:</span> KSh{" "}
                        {(service.price).toLocaleString()}
                    </p>
                </div>
                <Button onClick={() => (window.location.href = storeSlug ? `/store/${storeSlug}/services` : "/services")} className="w-full">
                    Back to Services
                </Button>
            </div>
        )
    }

    if (showOTP) {
        return <OTPVerification phoneNumber={phoneNumber} onVerified={handleOTPVerified} />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {!service.available && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>This service is currently unavailable for booking.</AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="0712345678 or +254712345678" {...field} />
                            </FormControl>
                            <FormDescription>We&apos;ll use this to send you the OTP for verification</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField control={form.control}
                           name={"notes"}
                           render={({ field }) => (
                               <FormItem>
                                   <FormControl>
                                       <TextAreaWithCount maxLength={300} {...field}/>
                                   </FormControl>
                                   <FormMessage />
                               </FormItem>
                           )}
                />

                {/*{service.requiresDownPayment && (*/}
                {/*    <Alert>*/}
                {/*        <AlertCircle className="h-4 w-4" />*/}
                {/*        <AlertDescription>*/}
                {/*            A down payment of KSh {(service.price * 0.5).toLocaleString()} (50%) is required to confirm this bookings.*/}
                {/*        </AlertDescription>*/}
                {/*    </Alert>*/}
                {/*)}*/}

                <Button type="submit" className="w-full" disabled={isSubmitting || !service.available}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Proceed to Verification"
                    )}
                </Button>
            </form>
        </Form>
    )
}
