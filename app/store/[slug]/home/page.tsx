import { BookingHero } from "@/components/booking-hero";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorks } from "@/components/how-it-works";
import { CTASection } from "@/components/cta-section";
import { Navbar } from "@/components/nav-bar";

interface StoreHomeRouteProps {
    params: Promise<{ slug: string }>;
}

export default async function StoreHomePage({ params }: StoreHomeRouteProps) {
    const { slug } = await params;

    return (
        <main className="min-h-screen">
            <Navbar storeSlug={slug} />
            <BookingHero />
            <FeaturesSection />
            <HowItWorks />
            <CTASection servicesHref={`/store/${slug}/services`} />
        </main>
    );
}
