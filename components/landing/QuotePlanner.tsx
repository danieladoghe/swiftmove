'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container, CalendarDays, ArrowRight } from 'lucide-react';
import { YARD_SPACES, fmtCAD, yardQuote } from '@/lib/booking';

const fieldShell =
  'flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5';
const fieldInput =
  'w-full bg-transparent text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/50';

export function QuotePlanner() {
  const router = useRouter();
  const [spaceId, setSpaceId] = useState('contractor');
  const [date, setDate] = useState('');

  const quote = yardQuote(spaceId);

  return (
    <section id="quote" className="scroll-mt-20 bg-[var(--bg)] px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#0E1013] px-6 py-16 md:px-16 md:py-20"
      >
        <Image src="/yard-6.jpg" alt="" aria-hidden fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1013] via-transparent to-[#0E1013]/60" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#F5921E] sm:text-sm">
            Reserve Your Space
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Lock In Launch Pricing
          </h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-white/60">
            Pick a yard and a move-in date — we&apos;ll email your first-month
            invoice with a secure payment link.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new URLSearchParams({ space: spaceId });
              if (date) q.set('date', date);
              router.push(`/book?${q.toString()}`);
            }}
            className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:grid-cols-[1.4fr_1fr_auto]"
          >
            <label className={fieldShell}>
              <Container size={17} className="flex-shrink-0 text-[#F5921E]" />
              <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className={fieldInput} aria-label="Yard size">
                {YARD_SPACES.filter((s) => !s.custom).map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0E1013]">
                    {s.name} ({s.dims}) — {fmtCAD(s.launch!)}/mo
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldShell}>
              <CalendarDays size={17} className="flex-shrink-0 text-[#F5921E]" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldInput} aria-label="Move-in date" />
            </label>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5921E] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FFA733]"
            >
              Reserve Your Space
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-white/70">
            {quote.space.name} at launch pricing ={' '}
            <span className="font-bold text-[#F5921E]">{fmtCAD(quote.monthly)}/month</span>
            {' '}(<s>{fmtCAD(quote.regular)}</s>) — you save {fmtCAD(quote.savings)} every month
          </p>
        </div>
      </motion.div>
    </section>
  );
}
