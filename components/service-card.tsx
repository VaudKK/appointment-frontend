import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar } from "lucide-react"
import {Service, TimeSlot} from "@/lib/types";
import {BookingDialog} from "@/components/booking-dialog";
import {useState} from "react";
import TimeSlotDialog from "@/components/time_slot_dialog";

interface ServiceCardProps {
    service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isBookingDialogOpen,setIsBookingDialogOpen] = useState(false)
    const isAvailable = service.available;
    const [timeSlot,setTimeSlot] = useState<TimeSlot>();

    const handleBooking = () => {
        setIsDialogOpen(true)
    }

    const handleSlotSelected = (slot: TimeSlot) => {
        setTimeSlot(slot)
        setIsBookingDialogOpen(true)
    }

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                        src={service.imageUrl || "/placeholder.png"}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                        <Badge variant={isAvailable ? "default" : "secondary"} className="shadow-md">
                            {isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                </div>

                <CardHeader className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">{service.name}</h3>
                    <div className="text-2xl font-bold text-primary">KSh {service.price.toLocaleString()}</div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{service.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{service.duration} mins</span>
                    </div>

                    <div className={"flex items-center gap-2 text-sm text-muted-foreground"}>
                        <span>{service.description}</span>
                    </div>

                    {/*{service.requiresDownPayment && (*/}
                    {/*    <div className="flex items-center gap-2 text-sm text-primary">*/}
                    {/*        <CreditCard className="h-4 w-4 flex-shrink-0" />*/}
                    {/*        <span>Down payment required</span>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </CardContent>

                <CardFooter>
                    <Button className="w-full" disabled={!isAvailable} onClick={handleBooking}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {isAvailable ? "Book Now" : "Not Available"}
                    </Button>
                </CardFooter>
            </Card>

            <TimeSlotDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                service={service}
                onSlotSelected={handleSlotSelected}
            />

            {timeSlot != null &&
                <BookingDialog service={service} timeSlot={timeSlot} open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen} />}

        </>
    )
}
