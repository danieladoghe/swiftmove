import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { YardGrid } from '@/components/landing/YardGrid';
import { ProductStrip } from '@/components/landing/ProductStrip';
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
        <YardGrid />
        <ProductStrip />
        <QuotePlanner />
        <YardNotes />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
