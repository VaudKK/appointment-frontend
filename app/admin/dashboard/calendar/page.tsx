"use client"

import { useEffect, useMemo, useState } from "react"
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from "date-fns"
import { AlertCircle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Appointment, PaginatedResponse } from "@/lib/types"
import { searchOrganizationBookings } from "@/lib/api/booking"
import { authClient } from "@/lib/auth-client"

const PAGE_SIZE = 500
const WEEK_STARTS_ON = 1

type ViewMode = "day" | "week" | "month"

type DateRange = {
    start: Date
    end: Date
    startLabel: string
    endLabel: string
    startQuery: string
    endQuery: string
}

function getRange(date: Date, view: ViewMode): DateRange {
    if (view === "day") {
        const start = startOfDay(date)
        const end = startOfDay(date)
        return {
            start,
            end,
            startLabel: format(start, "MMM d, yyyy"),
            endLabel: format(end, "MMM d, yyyy"),
            startQuery: format(start, "yyyy-MM-dd"),
            endQuery: format(end, "yyyy-MM-dd"),
        }
    }

    if (view === "week") {
        const start = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON })
        const end = endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON })
        return {
            start,
            end,
            startLabel: format(start, "MMM d"),
            endLabel: format(end, "MMM d, yyyy"),
            startQuery: format(start, "yyyy-MM-dd"),
            endQuery: format(end, "yyyy-MM-dd"),
        }
    }

    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return {
        start,
        end,
        startLabel: format(start, "MMM d"),
        endLabel: format(end, "MMM d, yyyy"),
        startQuery: format(start, "yyyy-MM-dd"),
        endQuery: format(end, "yyyy-MM-dd"),
    }
}

function getStatusStyle(status: Appointment["status"]) {
    switch (status) {
        case "Scheduled":
            return "bg-blue-800 text-white"
        case "Cancelled":
            return "bg-red-800 text-white"
        default:
            return "bg-muted text-muted-foreground"
    }
}

function parseAppointmentDate(appointment: Appointment): Date | null {
    const date = parseISO(appointment.appointmentTime)
    return Number.isNaN(date.getTime()) ? null : date
}

export default function CalendarViewPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("week")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [token, setToken] = useState<string | undefined>(undefined)

    useEffect(() => {
        authClient.token().then((tokenPayload) => {
            setToken(tokenPayload.data?.token)
        })
    }, [])

    const range = useMemo(() => getRange(selectedDate, viewMode), [selectedDate, viewMode])

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<PaginatedResponse<Appointment>>({
        queryKey: ["calendarBookings", token, range.startQuery, range.endQuery],
        queryFn: async () => {
            return searchOrganizationBookings(token ?? "", {
                startDate: range.startQuery,
                endDate: range.endQuery,
                page: 1,
                size: PAGE_SIZE,
            })
        },
        enabled: !!token,
    })

    const bookings = useMemo(() => {
        const list = data?.content ?? []
        return list
            .map((booking) => ({ booking, date: parseAppointmentDate(booking) }))
            .filter((item) => item.date !== null)
            .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0))
    }, [data])

    const changeDate = (direction: "prev" | "next") => {
        if (viewMode === "day") {
            setSelectedDate((current) => addDays(current, direction === "next" ? 1 : -1))
            return
        }

        if (viewMode === "week") {
            setSelectedDate((current) => addDays(current, direction === "next" ? 7 : -7))
            return
        }

        setSelectedDate((current) => addMonths(current, direction === "next" ? 1 : -1))
    }

    const setToday = () => setSelectedDate(new Date())

    const rangeLabel = range.startLabel === range.endLabel
        ? range.startLabel
        : `${range.startLabel} - ${range.endLabel}`

    const dayBookings = bookings.filter((item) =>
        item.date ? isSameDay(item.date, selectedDate) : false
    )

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: WEEK_STARTS_ON })
    const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))

    const monthStart = startOfMonth(selectedDate)
    const monthGridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON })
    const monthEnd = endOfMonth(selectedDate)
    const monthGridEnd = endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON })
    const monthDays: Date[] = []
    for (let day = monthGridStart; day <= monthGridEnd; day = addDays(day, 1)) {
        monthDays.push(day)
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Calendar View</h1>
                <p className="text-muted-foreground mt-1">
                    Plan and review bookings in a Google Calendar style layout.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <Card className="bg-card border-border h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-muted-foreground" />
                            Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            className="rounded-md border border-border bg-background"
                        />
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Selected</span>
                                <span className="font-medium text-foreground">{format(selectedDate, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">View Range</span>
                                <span className="font-medium text-foreground">{rangeLabel}</span>
                            </div>
                            {data && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Bookings</span>
                                    <span className="font-medium text-foreground">{data.totalElements}</span>
                                </div>
                            )}
                        </div>
                        {data && data.totalElements > data.size && (
                            <div className="text-xs text-muted-foreground border border-border rounded-md p-3">
                                Showing the first {data.size} bookings. Narrow the date range to see all entries.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="border-b border-border">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <select
                                        value={viewMode}
                                        onChange={(event) => setViewMode(event.target.value as ViewMode)}
                                        className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="day">Daily View</option>
                                        <option value="week">Weekly View</option>
                                        <option value="month">Monthly View</option>
                                    </select>
                                </div>
                                <Button variant="outline" onClick={setToday}>
                                    Today
                                </Button>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => changeDate("prev")}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => changeDate("next")}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-foreground">
                                {rangeLabel}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading && (
                            <div className="flex items-center justify-center py-16 text-muted-foreground">
                                Loading calendar bookings...
                            </div>
                        )}

                        {isError && (
                            <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/50 rounded-lg m-4">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive">{error?.message ?? "Failed to load bookings"}</p>
                            </div>
                        )}

                        {!isLoading && !isError && !token && (
                            <div className="flex gap-3 p-4 bg-muted border border-border rounded-lg m-4">
                                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">Sign in to view calendar bookings.</p>
                            </div>
                        )}

                        {!isLoading && !isError && token && bookings.length === 0 && (
                            <div className="flex items-center justify-center py-16 text-muted-foreground">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                No bookings found for this range.
                            </div>
                        )}

                        {!isLoading && !isError && token && bookings.length > 0 && (
                            <>
                                {viewMode === "day" && (
                                    <ScrollArea className="h-[540px]">
                                        <div className="space-y-3 p-6">
                                            {dayBookings.length === 0 ? (
                                                <div className="text-sm text-muted-foreground">No bookings for this day.</div>
                                            ) : (
                                                dayBookings.map(({ booking, date }) => (
                                                    <div
                                                        key={booking.id}
                                                        className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 shadow-sm"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">{date ? format(date, "h:mm a") : ""}</p>
                                                                <p className="text-base font-semibold text-foreground">{booking.customerName}</p>
                                                            </div>
                                                            <Badge className={cn("text-xs", getStatusStyle(booking.status))}>
                                                                {booking.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Appointment ID {booking.id}
                                                        </div>
                                                        {booking.notes && (
                                                            <div className="text-sm text-foreground/80 border-l-2 border-border pl-3">
                                                                {booking.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                )}

                                {viewMode === "week" && (
                                    <div className="grid grid-cols-1 md:grid-cols-7 border-t border-border">
                                        {weekDays.map((day) => {
                                            const dayItems = bookings.filter((item) => item.date && isSameDay(item.date, day))
                                            return (
                                                <div
                                                    key={day.toISOString()}
                                                    className="border-b border-border md:border-b-0 md:border-r border-border min-h-[220px]"
                                                >
                                                    <div className="p-3 border-b border-border bg-muted/30">
                                                        <div className="text-xs text-muted-foreground uppercase">{format(day, "EEE")}</div>
                                                        <div
                                                            className={cn(
                                                                "text-sm font-semibold",
                                                                isSameDay(day, selectedDate) && "text-primary",
                                                            )}
                                                        >
                                                            {format(day, "MMM d")}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 space-y-2">
                                                        {dayItems.length === 0 ? (
                                                            <div className="text-xs text-muted-foreground">No bookings</div>
                                                        ) : (
                                                            dayItems.map(({ booking, date }) => (
                                                                <div
                                                                    key={booking.id}
                                                                    className="rounded-md border border-border bg-background p-2 text-xs shadow-sm"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium text-foreground truncate">{booking.customerName}</span>
                                                                        <Badge className={cn("text-[10px]", getStatusStyle(booking.status))}>
                                                                            {booking.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="text-muted-foreground">
                                                                        {date ? format(date, "h:mm a") : ""}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {viewMode === "month" && (
                                    <div className="grid grid-cols-7 border-t border-border">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                                            <div key={label} className="p-3 text-xs font-semibold text-muted-foreground border-b border-border bg-muted/40">
                                                {label}
                                            </div>
                                        ))}
                                        {monthDays.map((day) => {
                                            const dayItems = bookings.filter((item) => item.date && isSameDay(item.date, day))
                                            return (
                                                <button
                                                    key={day.toISOString()}
                                                    className={cn(
                                                        "min-h-[120px] border-b border-border border-r border-border p-2 text-left transition-colors",
                                                        !isSameMonth(day, selectedDate) && "bg-muted/20 text-muted-foreground",
                                                        isSameDay(day, selectedDate) && "bg-primary/10",
                                                    )}
                                                    onClick={() => setSelectedDate(day)}
                                                    type="button"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold">{format(day, "d")}</span>
                                                        {dayItems.length > 0 && (
                                                            <span className="text-[10px] text-muted-foreground">{dayItems.length} booking{dayItems.length > 1 ? "s" : ""}</span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 max-h-[68px] overflow-y-auto pr-1 space-y-1">
                                                        {dayItems.slice(0, 2).map(({ booking }) => (
                                                            <div key={booking.id} className="truncate text-[10px] text-foreground/80">
                                                                {booking.customerName}
                                                            </div>
                                                        ))}
                                                        {dayItems.length > 2 && (
                                                            <div className="text-[10px] text-muted-foreground">+{dayItems.length - 2} more</div>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
