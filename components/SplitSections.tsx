'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';

interface SplitSectionProps {
  tag: string;
  headline: string;
  body: string;
  bullets: string[];
  imagePlaceholder: string;
  imageLabel: string;
  reverse?: boolean;
  bg?: string;
}

function SplitSection({
  tag, headline, body, bullets, imagePlaceholder, imageLabel, reverse = false, bg,
}: SplitSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={ref}
      className="section-pad overflow-hidden"
      style={{ background: bg ?? 'var(--surface-2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`
          flex flex-col gap-12 lg:gap-16 items-center
          ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}
        `}>
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 max-w-lg"
          >
            <span className="
              inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase
              bg-[var(--glow-soft)] text-[var(--accent)] border border-[var(--accent)]/20 mb-5
            ">
              {tag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">{headline}</h2>
            <p className="text-[var(--muted)] text-base leading-relaxed mb-7">{body}</p>
            <ul className="space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--text)] text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Visual side */}
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, x: reverse ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="
              relative w-full aspect-[4/3] rounded-2xl overflow-hidden
              border border-[var(--border)] shadow-[var(--shadow-lg)]
              bg-[var(--surface)]
            ">
              {/* Decorative image placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                  style={{ background: 'var(--glow-soft)' }}
                >
                  {imagePlaceholder}
                </div>
                <p className="text-[var(--muted)] text-sm font-medium text-center">{imageLabel}</p>
              </div>
              {/* Accent corner */}
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full"
                style={{ background: 'var(--accent)' }}
              />
              <div
                className="absolute bottom-0 left-0 w-24 h-24 opacity-10 rounded-tr-full"
                style={{ background: 'var(--accent)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SplitSections() {
  return (
    <div id="about">
      <SplitSection
        tag="Our Process"
        headline="Moving in 3 Simple Steps"
        body="We've stripped away all the complexity so you can focus on your new beginning. Our streamlined process gets you moved without the headache."
        bullets={[
          'Book online or call us for a free quote in minutes',
          'Our team arrives with all supplies — boxes, wrap, dollies',
          'We load, transport, unload, and place everything precisely',
        ]}
        imagePlaceholder="🚛"
        imageLabel="Our fleet of modern, GPS-tracked moving trucks"
        bg="var(--bg)"
      />

      <SplitSection
        tag="Equipment Shop"
        headline="Everything You Need to Pack Like a Pro"
        body="Skip the guesswork. Our curated selection of professional-grade moving supplies ensures your items arrive safely — whether you're moving across the street or across the country."
        bullets={[
          'Heavy-duty double-wall boxes in every size',
          'Bubble wrap, foam padding, and specialty wraps',
          'Professional-grade tape, markers, and labels',
          'Wardrobe boxes, dish packs, and mattress bags',
        ]}
        imagePlaceholder="📦"
        imageLabel="Premium moving supplies, shipped to your door"
        reverse
      />

      <SplitSection
        tag="Storage"
        headline="Flexible Storage When You Need It"
        body="Between moves? Need to de-clutter before listing your home? Our secure, climate-controlled storage facilities offer month-to-month flexibility with no long-term contracts."
        bullets={[
          '24/7 access with secure key-card entry',
          'Climate-controlled units from 5×5 to 20×20',
          'Insurance options available for complete peace of mind',
          'Free first month with any long-distance move package',
        ]}
        imagePlaceholder="🏢"
        imageLabel="Secure climate-controlled storage facilities"
        bg="var(--bg)"
      />
    </div>
  );
}
