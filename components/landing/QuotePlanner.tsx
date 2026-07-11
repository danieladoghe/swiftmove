'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container, CalendarDays, Clock, ArrowRight } from 'lucide-react';

const fields = [
  { icon: Container, placeholder: 'Space size — 20 / 30 / 40 ft', name: 'size' },
  { icon: CalendarDays, placeholder: 'Move-in date', name: 'date' },
  { icon: Clock, placeholder: 'How long do you need it?', name: 'duration' },
];

export function QuotePlanner() {
  const router = useRouter();

  return (
    <section id="quote" className="scroll-mt-20 bg-white px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#0E1013] px-6 py-16 md:px-16 md:py-20"
      >
        {/* Subtle low-opacity yard background */}
        <Image
          src="/yard-6.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1013] via-transparent to-[#0E1013]/60" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#F5921E] sm:text-sm">
            Plan Your Space
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Tell Us What You&apos;re Storing
          </h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-white/60">
            Thirty seconds, no obligation. We&apos;ll match you to the right
            footprint and lock in your prepay discount.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/contact');
            }}
            className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            {fields.map(({ icon: Icon, placeholder, name }) => (
              <label
                key={name}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5"
              >
                <Icon size={17} className="flex-shrink-0 text-[#F5921E]" />
                <input
                  name={name}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
                />
              </label>
            ))}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5921E] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FFA733]"
            >
              Get My Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
