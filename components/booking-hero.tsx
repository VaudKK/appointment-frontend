import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import Image from "next/image";

export function BookingHero() {
    return (
        <section className="relative overflow-hidden">
            <div className="container relative mx-auto px-4 py-20 md:py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Clock className="h-4 w-4" />
                Save Time, Book Smart
              </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                            Book Your Perfect
                            <span className="block text-primary mt-2">Appointment Today</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
                            Connect with professionals instantly. No phone calls, no waiting. Find available time slots and book
                            appointments in seconds.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-primary">10K+</div>
                                <div className="text-sm text-muted-foreground">Active Users</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">50K+</div>
                                <div className="text-sm text-muted-foreground">Bookings Made</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">2.5K+</div>
                                <div className="text-sm text-muted-foreground">Professionals</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden">
                            <Image
                                src="/homepage.svg" 
                                alt="Booking Interface" 
                                width={800} 
                                height={600}
                                className="w-full h-auto" 
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
