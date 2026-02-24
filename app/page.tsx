import { Hero } from '@/components/Hero';
import { ValueProps } from '@/components/ValueProps';
import { ServicesGrid } from '@/components/ServicesGrid';
import { SplitSections } from '@/components/SplitSections';
import { Stats } from '@/components/Stats';
import { Testimonials } from '@/components/Testimonials';
import { CTABanner } from '@/components/CTABanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesGrid />
      <SplitSections />
      <Stats />
      <Testimonials />
      <CTABanner />
    </>
  );
}
