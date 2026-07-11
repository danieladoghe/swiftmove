'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function BrandStory() {
  return (
    <section id="about" className="scroll-mt-20 bg-white px-4 py-24 text-gray-900 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Minimal centered text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#D97B0C] sm:text-sm">
            Our Story
          </p>
          <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            One Yard. Zero Hassle.
          </h2>
          <p className="text-lg font-light leading-relaxed text-gray-600">
            Mo&apos;s Yard started with one fenced lot and a promise: treat every
            trailer, pallet, and box like it belongs to family. Twelve years and
            6,000+ customers later, nothing about that has changed.
          </p>
        </motion.div>

        {/* Cinematic image with centered glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[500px] overflow-hidden rounded-[32px] md:h-[700px]"
        >
          <Image
            src="/yard-1.jpg"
            alt="Mo's Yard at night"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-xl rounded-[24px] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
              <p className="mb-4 text-2xl font-bold leading-snug text-white md:text-3xl">
                &ldquo;If it matters enough to store, it matters enough to guard.&rdquo;
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FFC074]">
                — Mo, Founder
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
