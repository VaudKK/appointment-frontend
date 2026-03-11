"use client"

import {useEffect, useState} from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { AlertCircle, Clock, Users, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {Service, TimeSlot} from "@/lib/types";
import {useQuery} from "@tanstack/react-query";
import {getAvailableSlots} from "@/lib/api/services";


interface TimeSlotDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    service: Service
    onSlotSelected: (slot: TimeSlot, date: Date) => void
}

export default function TimeSlotDialog({ isOpen, onOpenChange, service, onSlotSelected }: TimeSlotDialogProps) {
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [slotError, setError] = useState<string | null>(null)

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<TimeSlot[]>({
        queryKey: ["slots", service.id, selectedDate],
        queryFn: () => getAvailableSlots(service.id,selectedDate || new Date()),
        enabled: !!service.id && selectedDate != null,
    })

    useEffect(() => {
        if (isError) {
            setError(error?.message || 'An error occurred')
        }
    }, [isError, error])

    const handleBooking = () => {
        if (selectedSlot && selectedDate) {
            onSlotSelected(selectedSlot, selectedDate)
            onOpenChange(false)
            setSelectedSlot(null)
            setSelectedDate(null)
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedSlot(null)
            setSelectedDate(null)
            setError(null)
        }
        onOpenChange(open)
    }

    const handleBackToDatePicker = () => {
        setSelectedDate(null)
        setSelectedSlot(null)
    }

    const getTodayAtMidnight = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="max-w-lg w-full flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{service.name}</DialogTitle>
                </DialogHeader>

                {!selectedDate ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-center py-4 overflow-auto">
                            <Calendar
                                mode="single"
                                selected={selectedDate || undefined}
                                onSelect={(date) => date && setSelectedDate(date)}
                                disabled={(date) => date < getTodayAtMidnight()}
                                className="rounded-md border"
                                timeZone={"Africa/Nairobi"}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                        <Button variant="ghost" size="sm" onClick={handleBackToDatePicker} className="w-fit -ml-2 mb-3">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>

                        <div className="space-y-4 flex-1">
                            <div className="p-3 bg-primary/5 border border-primary/30 rounded-lg">
                                <p className="text-xs text-muted-foreground">Selected Date:</p>
                                <p className="font-semibold text-foreground">
                                    {selectedDate.toLocaleDateString("default", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            {error && (
                                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-destructive">{slotError}</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}

                            {!isLoading && !error && data?.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No available time slots for this date</p>
                                </div>
                            )}

                            {!isLoading && data && data?.length > 0 && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        {data.map((slot) => (
                                            <button
                                                key={slot.slotId}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={cn(
                                                    "p-3 rounded-lg border-2 transition-all text-left",
                                                    "hover:border-primary hover:bg-primary/5",
                                                    selectedSlot?.slotId === slot.slotId ? "border-primary bg-primary/10" : "border-border bg-card",
                                                )}
                                                disabled={slot.slotsAvailable === 0}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-semibold text-sm text-foreground">
                              {slot.startTime.substring(0, 5)}
                            </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">{slot.duration} mins</p>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3 h-3 text-muted-foreground" />
                                                            <span
                                                                className={cn(
                                                                    "text-xs font-medium",
                                                                    slot.slotsAvailable === 0 ? "text-destructive" : "text-foreground",
                                                                )}
                                                            >
                                {slot.slotsAvailable} {slot.slotsAvailable === 1 ? "spot" : "spots"}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedSlot && (
                                        <div className="p-3 bg-primary/5 border border-primary/30 rounded-lg">
                                            <p className="text-sm font-semibold text-foreground mb-1">Selected Time:</p>
                                            <p className="text-sm text-foreground">
                                                {selectedSlot.startTime} — {selectedSlot.endTime}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Duration: {selectedSlot.duration} minutes</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleBooking} disabled={!selectedSlot || isLoading} className="flex-1">
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
