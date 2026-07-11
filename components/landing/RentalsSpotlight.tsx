'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Forklift, Check, ArrowRight } from 'lucide-react';

const points = [
  'Daily & weekly rates with no hidden fees',
  'Delivered to your site, or pick up at the yard',
  'Certified operators available on request',
];

export function RentalsSpotlight() {
  return (
    <section id="rentals" className="scroll-mt-20 bg-[#FAFAFA] px-4 py-24 text-gray-900 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image with floating glass badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[480px] overflow-hidden rounded-[32px] lg:h-[600px]"
        >
          <Image
            src="/yard-forklift.jpg"
            alt="Forklift working in Mo's Yard"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Forklift size={22} className="text-[#F5921E]" />
            </div>
            <div>
              <p className="font-semibold text-white">Forklifts, pallet jacks & dollies</p>
              <p className="text-sm text-white/70">Daily & weekly rates — operators available</p>
            </div>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#D97B0C] sm:text-sm">
            Rentals
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Pro Equipment, When You Need It
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-gray-600">
            Don&apos;t buy a forklift for one weekend. Rent exactly the muscle your
            move or job site needs — maintained, inspected, and ready the moment
            you pull in.
          </p>
          <ul className="mb-9 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3.5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F5921E]/15">
                  <Check size={15} className="text-[#D97B0C]" />
                </span>
                <span className="text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 font-semibold text-[#D97B0C] transition-colors hover:text-[#F5921E]"
          >
            See rental rates
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
