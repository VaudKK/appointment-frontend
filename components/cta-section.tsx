import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                        Ready to Transform Your Booking Experience?
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-pretty leading-relaxed">
                        Join thousands of satisfied users who&apos;ve simplified their scheduling. Start booking appointments the smart
                        way today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href={"/services"}>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 h-14 shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                Show Available Bookings
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-12 flex flex-wrap justify-center gap-8 opacity-80">
                        <div className="text-sm">
                            <div className="font-semibold">✓ Verified</div>
                            <div>Secure Platform</div>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold">24/7</div>
                            <div>Support Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
