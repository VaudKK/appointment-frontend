"use client"

import { useState, Suspense } from "react"
import { Search, Calendar, AlertCircle, X } from "lucide-react"
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
import {useQuery} from "@tanstack/react-query";
import {Appointment, PaginatedResponse} from "@/lib/types";
import {getOrganizationBookings} from "@/lib/api/booking";
import {format, parseISO} from "date-fns";


function BookingsContent() {
    const [searchPhone, setSearchPhone] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageSize,setCurrentPageSize] = useState(10)


    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<PaginatedResponse<Appointment>>({
        queryKey: ["organizationBookings", 1,currentPage],
        queryFn: () => getOrganizationBookings("1",currentPage,currentPageSize),
    })


    if (isLoading){
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
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
                        {/* Phone Number Search */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by phone..."
                                    value={searchPhone}
                                    onChange={(e) => {
                                        setSearchPhone(e.target.value)
                                        setCurrentPage(1)
                                        setCurrentPageSize(10)
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
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(e.target.value)
                                        setCurrentPage(1)
                                        setCurrentPageSize(10)
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
                                    value={dateTo}
                                    onChange={(e) => {
                                        setDateTo(e.target.value)
                                        setCurrentPage(1)
                                        setCurrentPageSize(10)
                                    }}
                                    className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Bookings List ({data?.totalElements} total)</CardTitle>
                </CardHeader>
                <CardContent>
                    {data?.content.length === 0 ? (
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
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => alert(`Cancel booking ${booking.id}`)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </Button>
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
