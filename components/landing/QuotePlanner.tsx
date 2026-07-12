'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container, CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { STORAGE_SIZES, STORAGE_TERMS, fmtUSD, storageQuote } from '@/lib/booking';

const fieldShell =
  'flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5';
const fieldInput =
  'w-full bg-transparent text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/50';

export function QuotePlanner() {
  const router = useRouter();
  const [size, setSize] = useState('30');
  const [months, setMonths] = useState(1);
  const [date, setDate] = useState('');

  const quote = storageQuote(size, months);

  return (
    <section id="quote" className="scroll-mt-20 bg-[var(--bg)] px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
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
            Price a Space in Seconds
          </h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-white/60">
            Pick a size and term — your quote updates live, prepay discount
            included. Finish the booking on the next page.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new URLSearchParams({ service: 'storage', size, months: String(months) });
              if (date) q.set('date', date);
              router.push(`/book?${q.toString()}`);
            }}
            className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <label className={fieldShell}>
              <Container size={17} className="flex-shrink-0 text-[#F5921E]" />
              <select value={size} onChange={(e) => setSize(e.target.value)} className={fieldInput} aria-label="Space size">
                {STORAGE_SIZES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0E1013]">
                    {s.label} — {fmtUSD(s.monthly)}/mo
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldShell}>
              <CalendarDays size={17} className="flex-shrink-0 text-[#F5921E]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={fieldInput}
                aria-label="Move-in date"
              />
            </label>
            <label className={fieldShell}>
              <Clock size={17} className="flex-shrink-0 text-[#F5921E]" />
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className={fieldInput} aria-label="Term">
                {STORAGE_TERMS.map((t) => (
                  <option key={t.months} value={t.months} className="bg-[#0E1013]">
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5921E] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FFA733]"
            >
              Book It
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-white/70">
            {quote.term.months > 1 ? (
              <>
                {quote.size.label} × {quote.term.months} months ={' '}
                <span className="font-bold text-[#F5921E]">{fmtUSD(quote.total)}</span>
                {quote.savings > 0 && <> — you save {fmtUSD(quote.savings)}</>}
              </>
            ) : (
              <>
                {quote.size.label} = <span className="font-bold text-[#F5921E]">{fmtUSD(quote.total)}/month</span>, cancel anytime
              </>
            )}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
