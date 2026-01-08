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
import {CreateAppointmentRequest, Service} from "@/lib/types";
import {useMutation} from "@tanstack/react-query";
import {createBooking} from "@/lib/api/booking";


interface BookingFormProps {
    service: Service
    onSuccess?: () => void
}

const bookingSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z.string().regex(/^(\+254|0)[0-9]{9}$/, "Please enter a valid Kenyan phone number (e.g., 0712345678)"),
    date: z.string().refine((date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today
    }, "Please select a date from today onwards"),
    time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time"),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function BookingForm({ service }: BookingFormProps) {
    const [showOTP, setShowOTP] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            date: "",
            time: "",
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
            serviceId: service.id,
            appointmentTime: `${booking.date} ${booking.time}`,
            notes: "",
            userId: null,
            organizationId: service.organizationId
        }
        bookingMutation.mutate(bookingRequest)
    }

    const validateDateTimeAvailability = (date: string, time: string): boolean => {
        if (!date || !time) return false

        const selectedDateTime = new Date(`${date}T${time}`)

        // Check if it's within business hours (8 AM to 6 PM)
        const hours = selectedDateTime.getHours()
        if (hours < 8 || hours >= 18) {
            return false
        }

        return true
    }

    const onSubmit = async (values: BookingFormValues) => {
        // Validate date/time availability
        if (!validateDateTimeAvailability(values.date, values.time)) {
            form.setError("time", {
                type: "manual",
                message: "Selected time is not available. Services operate 8 AM - 6 PM with at least 1 hour advance booking.",
            })
            return
        }

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
                    <p className="text-sm mb-2">
                        <span className="font-semibold">Date & Time:</span> {form.getValues("date")} at {form.getValues("time")}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Total Amount:</span> KSh{" "}
                        {(service.price).toLocaleString()}
                    </p>
                </div>
                <Button onClick={() => (window.location.href = "/services")} className="w-full">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <input
                                    type="date"
                                    {...field}
                                    defaultValue={new Date().toISOString().split("T")[0]}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <FormDescription>Select a date from today onwards</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <input
                                    type="time"
                                    {...field}
                                    step={900}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <FormDescription>Business hours: 8 AM - 6 PM</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/*{service.requiresDownPayment && (*/}
                {/*    <Alert>*/}
                {/*        <AlertCircle className="h-4 w-4" />*/}
                {/*        <AlertDescription>*/}
                {/*            A down payment of KSh {(service.price * 0.5).toLocaleString()} (50%) is required to confirm this booking.*/}
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
