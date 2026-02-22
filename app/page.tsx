import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck2, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
    {
        title: "Capture More Bookings",
        description:
            "Turn website visitors and social traffic into confirmed appointments with a shareable booking link.",
        image: "/services-150.svg",
        icon: CalendarCheck2,
    },
    {
        title: "Reduce No-Shows",
        description:
            "Automated scheduling and clear availability improve commitment and make your daily operations predictable.",
        image: "/tick-150.svg",
        icon: ShieldCheck,
    },
    {
        title: "Scale Without Admin Overhead",
        description:
            "Organize services, time slots, and team capacity in one place so your business can grow efficiently.",
        image: "/time-150.svg",
        icon: TrendingUp,
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-linear-to-b from-background to-muted/30">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">KwaWakati</div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/admin/me/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/me/signup">Create Store Today</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                            Booking Infrastructure for Growth-Oriented Businesses
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Run a Professional Booking Experience That Wins Customer Trust
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            KwaWakati helps service businesses standardize scheduling, increase conversion, and deliver a modern customer
                            journey with a branded store URL.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="/admin/me/signup">
                                    Create Store Today
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/admin/me/signin">I Already Have an Account</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card shadow-sm">
                        <Image src="/homepage.svg" alt="Business booking platform" width={720} height={420} className="w-full h-auto rounded-2xl" priority />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 pb-20">
                <div className="grid gap-6 md:grid-cols-3">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={benefit.title} className="border-border bg-card/70 backdrop-blur">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Image src={benefit.image} alt={benefit.title} width={56} height={56} />
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">{benefit.title}</h2>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            <section className="container mx-auto px-4 pb-24">
                <div className="rounded-2xl border bg-primary text-primary-foreground p-8 md:p-12 text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Give Customers a Faster Way to Book Your Services</h2>
                    <p className="max-w-2xl mx-auto opacity-90">
                        Launch your store URL, publish your services, and start accepting bookings in minutes.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/admin/me/signup">Create Store Today</Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}
