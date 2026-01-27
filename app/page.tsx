import {BookingHero} from "@/components/booking-hero";
import {FeaturesSection} from "@/components/features-section";
import {HowItWorks} from "@/components/how-it-works";
import {CTASection} from "@/components/cta-section";
import { Navbar } from "@/components/nav-bar";

export default function Home() {

  return (
      <>
          <main className="min-h-screen">
              <Navbar/>
              <BookingHero />
              <FeaturesSection />
              <HowItWorks />
              <CTASection />
          </main>
      </>
  );
}
