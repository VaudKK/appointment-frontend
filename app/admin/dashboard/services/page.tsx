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
    const {data: session} = authClient.useSession()

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<PaginatedResponse<Service>>({
        queryKey: ["services"],
        queryFn: () => getOrganizationServices(session ? session.session.userId : ''),
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
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="w-4 h-4" />
                            Create Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Create New Service</DialogTitle>
                        </DialogHeader>
                        <CreateServiceForm onCancel={() => setIsDialogOpen(false)} />
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
                                        <TableRow key={service.id} className="border-border hover:bg-sidebar">
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
                                                        <Switch
                                                            checked={service.available}
                                                            onCheckedChange={() => toggleServiceAvailability()}
                                                            className="data-[state=checked]:bg-green-600"
                                                        />
                                                    </div>
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
        </div>
    )
}
