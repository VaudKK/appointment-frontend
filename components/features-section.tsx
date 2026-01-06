import { Card, CardContent } from "@/components/ui/card"
import { Bell, Shield, Sparkles, Zap } from "lucide-react"

const features = [
    {
        icon: Zap,
        title: "Instant Booking",
        description: "Book appointments in real-time with automatic confirmation and calendar sync.",
    },
    {
        icon: Bell,
        title: "Smart Reminders",
        description: "Never miss an appointment with automated notifications and reminders.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your data is encrypted and protected with enterprise-grade security.",
    },
    {
        icon: Sparkles,
        title: "Easy Rescheduling",
        description: "Change your plans? Reschedule or cancel appointments with one click.",
    },
]

export function FeaturesSection() {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                        Everything You Need to Book Smarter
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Powerful features designed to make appointment booking effortless for everyone.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="pt-6 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
