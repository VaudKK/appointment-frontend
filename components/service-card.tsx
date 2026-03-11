import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar, Loader2, CircleDollarSign } from "lucide-react"
import {Service, TimeSlot} from "@/lib/types";
import {BookingDialog} from "@/components/booking-dialog";
import {useEffect, useState} from "react";
import TimeSlotDialog from "@/components/time_slot_dialog";
import { getSignedImageUrl } from "@/lib/api/files";

interface ServiceCardProps {
    service: Service
    storeSlug?: string
}

export function ServiceCard({ service, storeSlug }: ServiceCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isBookingDialogOpen,setIsBookingDialogOpen] = useState(false)
    const isAvailable = service.available;
    const [timeSlot,setTimeSlot] = useState<TimeSlot>();
    const [resolvedImageSrc, setResolvedImageSrc] = useState<{ key: string; url: string } | null>(null);
    const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
    const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null);
    const hasDirectImageUrl =
        Boolean(service.imageUrl) &&
        (service.imageUrl.startsWith("http://") || service.imageUrl.startsWith("https://"));
    const hasImageKey = Boolean(service.imageUrl) && !hasDirectImageUrl;
    const imageSrc = hasDirectImageUrl
        ? service.imageUrl
        : (resolvedImageSrc?.key === service.imageUrl ? resolvedImageSrc.url : "/placeholder.png");
    const isImageResolving =
        hasImageKey &&
        resolvedImageSrc?.key !== service.imageUrl &&
        failedImageKey !== service.imageUrl;
    const isImageLoading = isImageResolving || loadedImageSrc !== imageSrc;

    useEffect(() => {
        const rawImage = service.imageUrl;

        if (!rawImage || rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
            return;
        }

        let isMounted = true;
        getSignedImageUrl(rawImage)
            .then((url) => {
                if (isMounted) {
                    setResolvedImageSrc({ key: rawImage, url });
                }
            })
            .catch(() => {
                if (isMounted) {
                    setFailedImageKey(rawImage);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [service.imageUrl]);

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
                    {isImageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                    <img
                        src={imageSrc}
                        alt={service.name}
                        onLoad={() => setLoadedImageSrc(imageSrc)}
                        onError={() => setLoadedImageSrc(imageSrc)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                        <Badge variant={isAvailable ? "default" : "secondary"} className="shadow-md">
                            {isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                    {service.downPaymentRequired && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="shadow-md gap-1.5">
                                <CircleDollarSign className="h-3.5 w-3.5" />
                                Down Payment
                            </Badge>
                        </div>
                    )}
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
                <BookingDialog
                    service={service}
                    timeSlot={timeSlot}
                    open={isBookingDialogOpen}
                    onOpenChange={setIsBookingDialogOpen}
                    storeSlug={storeSlug}
                />}

        </>
    )
}
