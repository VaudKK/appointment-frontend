import { Card, CardContent } from "@/components/ui/card"

const steps = [
    {
        number: "01",
        title: "Browse Services",
        description: "Search through our network of verified services.",
        image: "/services-150.svg",
    },
    {
        number: "02",
        title: "Select Time Slot",
        description: "View real-time availability and choose a time that works best for you.",
        image: "/time-150.svg",
    },
    {
        number: "03",
        title: "Confirm & Done",
        description: "Receive instant confirmation and automated reminders before your appointment.",
        image: "/tick-150.svg",
    },
]

export function HowItWorks() {
    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">How It Works</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Three simple steps to your perfect appointment
                    </p>
                </div>

                <div className="grid gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div
                                    className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                                >
                                    <div className={`p-8 md:p-12 space-y-4 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                                        <div className="inline-block">
                                            <span className="text-5xl md:text-6xl font-bold text-primary/20">{step.number}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                                        <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                    <div
                                        className={`relative h-full ${index % 2 === 1 ? "md:order-1" : ""}`}
                                    >
                                        <img
                                            src={step.image || "/placeholder.svg"}
                                            alt={step.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
