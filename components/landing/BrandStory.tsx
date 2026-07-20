'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function BrandStory() {
  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden bg-[var(--surface-2)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
            Our Story
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Built for the Businesses of Okotoks
          </h2>
          <div className="space-y-4 text-[var(--muted)]">
            <p className="leading-relaxed">
              Mo&apos;s Yard was created to provide businesses, contractors, and
              residents in Okotoks and surrounding communities with a secure,
              convenient, and flexible place to store their equipment, vehicles,
              materials, and belongings.
            </p>
            <p className="leading-relaxed">
              After recognizing the challenges small businesses face finding
              affordable and accessible storage solutions, we built Mo&apos;s Yard to
              offer more than just space — we provide a reliable operating partner
              with storage, rentals, moving supplies, and logistics support all in
              one location.
            </p>
            <p className="leading-relaxed">
              Our goal is simple: help local businesses save time, stay organized,
              and grow by providing the space and services they need to operate
              efficiently.
            </p>
            <p className="font-semibold text-[var(--text)]">
              Welcome to Mo&apos;s Yard — Storage. Rentals. Logistics.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[380px] overflow-hidden rounded-[32px] lg:h-[520px]"
        >
          <Image
            src="/yard-1.jpg"
            alt="Mo's Yard at night"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-md">
            <p className="font-semibold">247 Don Seaman Way, Okotoks</p>
            <p className="text-sm text-white/70">Serving Okotoks, High River, Foothills County & South Calgary</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
