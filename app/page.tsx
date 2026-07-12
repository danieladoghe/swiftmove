import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { FeatureBar } from '@/components/landing/FeatureBar';
import { YardGrid } from '@/components/landing/YardGrid';
import { ProductStrip } from '@/components/landing/ProductStrip';
import { RentalsSpotlight } from '@/components/landing/RentalsSpotlight';
import { BrandStory } from '@/components/landing/BrandStory';
import { QuotePlanner } from '@/components/landing/QuotePlanner';
import { YardNotes } from '@/components/landing/YardNotes';
import { ContactSection } from '@/components/landing/ContactSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="landing-root bg-[#0E1013]">
      <LandingNav />
      <main>
        <LandingHero />
        <FeatureBar />
        <YardGrid />
        <ProductStrip />
        <RentalsSpotlight />
        <BrandStory />
        <QuotePlanner />
        <YardNotes />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
