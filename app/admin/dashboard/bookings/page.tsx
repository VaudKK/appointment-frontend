"use client"

import {useState, Suspense, useEffect} from "react"
import { Search, Calendar, AlertCircle} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {useMutation, useQuery} from "@tanstack/react-query";
import {Appointment, PaginatedResponse} from "@/lib/types";
import {cancelBooking, getOrganizationBookings, searchOrganizationBookings} from "@/lib/api/booking";
import {format, parseISO} from "date-fns";
import Loader from "@/components/loader";
import {authClient} from "@/lib/auth-client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";


function BookingsContent() {
    const [slotInput, setSlotInput] = useState("")
    const [searchSlot, setSearchSlot] = useState("")
    const [dateFromInput, setDateFromInput] = useState("")
    const [dateToInput, setDateToInput] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageSize,setCurrentPageSize] = useState(10)
    const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState<Appointment | null>(null)
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
    const [cancelError, setCancelError] = useState<string | null>(null)

    const [token,setToken] = useState<string | undefined>(undefined)

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<PaginatedResponse<Appointment>>({
        queryKey: ["organizationBookings", token, currentPage, currentPageSize, searchSlot, dateFrom, dateTo],
        queryFn: async () => {
            const hasDateRange = dateFrom.length > 0 && dateTo.length > 0
            const hasSearchFilters = searchSlot.trim().length > 0 || hasDateRange

            if (hasSearchFilters) {
                return searchOrganizationBookings(token ?? "", {
                    slot: searchSlot,
                    startDate: hasDateRange ? dateFrom : undefined,
                    endDate: hasDateRange ? dateTo : undefined,
                    page: currentPage,
                    size: currentPageSize,
                })
            }

            return getOrganizationBookings(token ?? '',currentPage,currentPageSize)
        },
        enabled: !!token
    })

    useEffect(() => {
        authClient.token().then((tokenPayload) => {
            setToken(tokenPayload.data?.token)
        })
    }, []);


    const getStatusColor = (status: string) => {
        switch (status) {
            case "Scheduled":
                return "bg-blue-800 text-white"
            case "Cancelled":
                return "bg-red-800 text-white"
            default:
                return "bg-gray-500/20 text-gray-300"
        }
    }

    const openBookingDetails = (booking: Appointment) => {
        setSelectedBooking(booking)
        setIsDetailsOpen(true)
    }

    const openCancelDialog = (booking: Appointment) => {
        if (booking.downPaymentAmount > 0) {
            toast.error("This booking has a down payment and cannot be cancelled.")
            return
        }
        setBookingToCancel(booking)
        setCancelError(null)
        setIsCancelDialogOpen(true)
    }

    const cancelBookingMutation = useMutation({
        mutationFn: async (appointmentId: string) => {
            if (!token) {
                throw new Error("Missing auth token")
            }
            await cancelBooking(token, appointmentId)
        },
        onSuccess: async () => {
            setIsCancelDialogOpen(false)
            setBookingToCancel(null)
            setCancelError(null)
            toast.success("Booking cancelled successfully")
            await refetch()
        },
        onError: (mutationError: Error) => {
            setCancelError(mutationError.message || "Failed to cancel booking")
        }
    })

    const confirmCancelBooking = async () => {
        if (!bookingToCancel) {
            return
        }

        if (bookingToCancel.downPaymentAmount > 0) {
            setCancelError("Bookings with a down payment cannot be cancelled.")
            return
        }
        await cancelBookingMutation.mutateAsync(bookingToCancel.id)
    }

    if (isLoading){
        return (
            <Loader/>
        )
    }

    if (isError){
        return (
            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
                <p className="text-muted-foreground mt-1">Manage and track all customer bookings</p>
            </div>

            {/* Filters */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Slot Search */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Slot ID</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by slot ID..."
                                    value={slotInput}
                                    onChange={(e) => {
                                        setSlotInput(e.target.value)
                                    }}
                                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Date From</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="date"
                                    value={dateFromInput}
                                    onChange={(e) => {
                                        setDateFromInput(e.target.value)
                                    }}
                                    className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                                />
                            </div>
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Date To</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="date"
                                    value={dateToInput}
                                    onChange={(e) => {
                                        setDateToInput(e.target.value)
                                    }}
                                    className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSlotInput("")
                                setSearchSlot("")
                                setDateFromInput("")
                                setDateToInput("")
                                setDateFrom("")
                                setDateTo("")
                                setCurrentPage(1)
                                setCurrentPageSize(10)
                            }}
                        >
                            Clear Search
                        </Button>
                        <Button
                            onClick={() => {
                                setSearchSlot(slotInput.trim())
                                setDateFrom(dateFromInput)
                                setDateTo(dateToInput)
                                setCurrentPage(1)
                                setCurrentPageSize(10)
                            }}
                        >
                            Search
                        </Button>
                    </div>
                    {(dateFromInput.length > 0 || dateToInput.length > 0) && !(dateFromInput.length > 0 && dateToInput.length > 0) && (
                        <p className="text-xs text-muted-foreground">
                            Select both Date From and Date To to search by date range.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Bookings List ({data?.totalElements} total)</CardTitle>
                </CardHeader>
                <CardContent>
                    {data?.content == null || data?.content.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            No bookings found
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="text-foreground">Customer</TableHead>
                                            <TableHead className="text-foreground">SlotNo</TableHead>
                                            <TableHead className="text-foreground">Appointment Time</TableHead>
                                            <TableHead className="text-foreground">Status</TableHead>
                                            <TableHead className="text-foreground">Date</TableHead>
                                            <TableHead className="text-foreground">Notes</TableHead>
                                            <TableHead className="text-foreground text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data?.content.map((booking) => (
                                            <TableRow key={booking.id} className="border-border hover:bg-sidebar">
                                                <TableCell className="text-foreground font-medium">{booking.customerName}</TableCell>
                                                <TableCell className="text-muted-foreground">{booking.slotId}</TableCell>
                                                <TableCell className="text-muted-foreground">{format(parseISO(booking.appointmentTime),'MMM d, yyyy h:mm a')}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-xs", getStatusColor(booking.status))}>{booking.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                                    {booking.notes}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={cn("flex items-center gap-2")}>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={() => openBookingDetails(booking)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="gap-2"
                                                            disabled={booking.status === "Cancelled" || booking.downPaymentAmount > 0}
                                                            onClick={() => openCancelDialog(booking)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {data && data.totalPages > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: data?.totalPages }).map((_, i) => (
                                                <PaginationItem key={i + 1}>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        isActive={currentPage === i + 1}
                                                        className="cursor-pointer"
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setCurrentPage(Math.min(data?.totalPages, currentPage + 1))}
                                                    className={currentPage === data?.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Detailed information for the selected booking.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Booking ID</p>
                                <p className="font-medium text-foreground break-all">{selectedBooking.id}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-medium text-foreground">{selectedBooking.customerName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge className={cn("text-xs mt-1", getStatusColor(selectedBooking.status))}>
                                    {selectedBooking.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Slot Number</p>
                                <p className="font-medium text-foreground">{selectedBooking.slotId}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Appointment Time</p>
                                <p className="font-medium text-foreground">
                                    {format(parseISO(selectedBooking.appointmentTime), "MMM d, yyyy h:mm a")}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Created At</p>
                                <p className="font-medium text-foreground">
                                    {format(parseISO(selectedBooking.createdAt), "MMM d, yyyy h:mm a")}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-muted-foreground">Notes</p>
                                <p className="font-medium text-foreground whitespace-pre-wrap">
                                    {selectedBooking.notes || "No notes provided."}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this booking?
                        </DialogDescription>
                    </DialogHeader>
                    {bookingToCancel && (
                        <div className="space-y-4">
                            <div className="rounded-md border border-border p-3 text-sm">
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-medium text-foreground">{bookingToCancel.customerName}</p>
                                <p className="text-muted-foreground mt-2">Appointment</p>
                                <p className="font-medium text-foreground">
                                    {format(parseISO(bookingToCancel.appointmentTime), "MMM d, yyyy h:mm a")}
                                </p>
                            </div>

                            {cancelError && (
                                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-destructive">{cancelError}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCancelDialogOpen(false)}
                                    disabled={cancelBookingMutation.isPending}
                                >
                                    Keep Booking
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmCancelBooking}
                                    disabled={cancelBookingMutation.isPending}
                                >
                                    {cancelBookingMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function BookingsPage() {
    return (
        <Suspense fallback={null}>
            <BookingsContent />
        </Suspense>
    )
}
