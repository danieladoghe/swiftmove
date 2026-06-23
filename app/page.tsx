import { Hero } from '@/components/Hero';
import { ValueProps } from '@/components/ValueProps';
import { ServicesGrid } from '@/components/ServicesGrid';
import { SplitSections } from '@/components/SplitSections';
import { OutdoorStorage } from '@/components/OutdoorStorage';
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
      <OutdoorStorage />
      <Stats />
      <Testimonials />
      <CTABanner />
    </>
  );
}
