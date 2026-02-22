"use client"

import {useState} from "react"
import { Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {PaginatedResponse, Service} from "@/lib/types";
import {useQuery} from "@tanstack/react-query";
import {getOrganizationServices} from "@/lib/api/services";
import {CreateServiceForm} from "@/components/create-service-form";
import FetchError from "@/components/fetch-error";
import {authClient} from "@/lib/auth-client";


export default function ServicesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)
    const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const {data: session} = authClient.useSession()

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<PaginatedResponse<Service>>({
        queryKey: ["services"],
        queryFn: () => getOrganizationServices(session ? session.user.organizationId : ''),
        enabled: !!session
    })


    if (isLoading){
        return (
            <div className="flex justify-center min-h-screen items-center py-8">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (isError){
        return (
           <FetchError message={error.message}/>
        )
    }

    const toggleServiceAvailability = () => {

    }

    const handleServiceRowClick = (service: Service) => {
        setSelectedService(service)
        setIsServiceDetailsOpen(true)
    }

    const handleCreateClick = () => {
        setIsEditMode(false)
        setServiceToEdit(null)
        setIsDialogOpen(true)
    }

    const handleEditClick = (service: Service) => {
        setIsEditMode(true)
        setServiceToEdit(service)
        setIsDialogOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Services</h1>
                    <p className="text-muted-foreground mt-1">Manage your service offerings</p>
                </div>

                {/* Create Service Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCreateClick}>
                            <Plus className="w-4 h-4" />
                            Create Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">{isEditMode ? "Edit Service" : "Create New Service"}</DialogTitle>
                        </DialogHeader>
                        <CreateServiceForm
                            key={isEditMode ? `edit-${serviceToEdit?.id ?? "unknown"}` : "create-service"}
                            onCancel={() => {
                                setIsDialogOpen(false)
                                setIsEditMode(false)
                                setServiceToEdit(null)
                            }}
                            onSaved={() => {
                                refetch()
                            }}
                            mode={isEditMode ? "edit" : "create"}
                            initialService={serviceToEdit}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Services Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Services List ({data?.totalElements} total)</CardTitle>
                </CardHeader>
                <CardContent>
                    {data?.content.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            No services found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-foreground">Service Name</TableHead>
                                        <TableHead className="text-foreground">Location</TableHead>
                                        <TableHead className="text-foreground">Price</TableHead>
                                        <TableHead className="text-foreground">Duration</TableHead>
                                        <TableHead className="text-foreground">BufferTime</TableHead>
                                        <TableHead className="text-foreground">Status</TableHead>
                                        <TableHead className="text-foreground text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.content.map((service) => (
                                        <TableRow
                                            key={service.id}
                                            className="border-border hover:bg-sidebar cursor-pointer"
                                            onClick={() => handleServiceRowClick(service)}
                                        >
                                            <TableCell className="text-foreground font-medium">{service.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{service.location}</TableCell>
                                            <TableCell className="text-muted-foreground">Ksh {service.price}</TableCell>
                                            <TableCell className="text-muted-foreground">{service.duration} min</TableCell>
                                            <TableCell className="text-muted-foreground">{service.bufferTime} min</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        "text-xs",
                                                        service.available ? "bg-green-800 text-white" : "bg-gray-500/20 text-gray-300",
                                                    )}
                                                >
                                                    {service.available ? "Available" : "Unavailable"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                        {service.available ? "Available" : "Unavailable"}
                                                        </span>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <Switch
                                                                    checked={service.available}
                                                                    onCheckedChange={() => toggleServiceAvailability()}
                                                                    className="data-[state=checked]:bg-green-600"
                                                                />
                                                            </div>
                                                    </div>
                                                    <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEditClick(service)
                                                            }}
                                                        >
                                                            Edit
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isServiceDetailsOpen} onOpenChange={setIsServiceDetailsOpen}>
                <DialogContent className="bg-card border-border max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Service Details</DialogTitle>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">{selectedService.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="text-foreground">{selectedService.location}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Price</p>
                                    <p className="text-foreground">Ksh {selectedService.price}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Duration</p>
                                    <p className="text-foreground">{selectedService.duration} min</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Buffer Time</p>
                                    <p className="text-foreground">{selectedService.bufferTime} min</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Slots Per Duration</p>
                                    <p className="text-foreground">{selectedService.slotsPerTimeDuration}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge
                                        className={cn(
                                            "text-xs",
                                            selectedService.available ? "bg-green-800 text-white" : "bg-gray-500/20 text-gray-300",
                                        )}
                                    >
                                        {selectedService.available ? "Available" : "Unavailable"}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Available Days</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedService.days.length > 0 ? (
                                        selectedService.days.map((day) => (
                                            <Badge key={day} variant="secondary">
                                                {day}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No days configured</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
