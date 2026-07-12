'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Truck, Package, BadgePercent, Check, ArrowRight } from 'lucide-react';
import { STORAGE_SIZES, fmtCAD } from '@/lib/booking';

const SIZE_FEATURES = [
  'Secure, gated outdoor lot',
  'Drive-up access',
  'Month-to-month — no contract',
];

const services = [
  {
    icon: Truck,
    title: 'Moving Crews',
    price: `from ${fmtCAD(89)}/hr`,
    blurb: 'Book movers by the hour — with our truck or just the muscle.',
    cta: { label: 'Book a crew', href: '/book?service=movers' },
  },
  {
    icon: Container,
    title: 'Freight & Logistics',
    price: 'Custom quotes',
    blurb: 'Single pallets to full truckloads, moved on your schedule.',
    cta: { label: 'Get a freight quote', href: '/contact' },
  },
  {
    icon: Package,
    title: 'Moving Supplies',
    price: 'Shop online',
    blurb: 'Boxes, blankets, tape, and kits — the gear our own crews use.',
    cta: { label: 'Browse the shop', href: '/shop' },
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
} as const;

export function YardGrid() {
  return (
    <section id="yard" className="relative scroll-mt-20 overflow-hidden bg-[var(--bg)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      {/* Background details */}
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -left-48 bottom-0 h-[360px] w-[360px] rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
            The Yard
          </p>
          <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Space for Every Season
          </h2>
          <p className="text-lg font-light leading-relaxed text-[var(--muted)]">
            Pick a footprint, book a crew, or hand us the whole move. All prices
            in CAD.
          </p>
        </motion.div>

        {/* Storage pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {STORAGE_SIZES.map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-[20px] border bg-[var(--surface)] p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl ${
                s.popular ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : 'border-[var(--border)]'
              }`}
            >
              {s.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-0.5 text-[11px] font-bold text-white">
                  Most Popular
                </span>
              )}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
                <Container size={20} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-bold">{s.label}</h3>
              <p className="mb-1 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
              <p className="my-4">
                <span className="text-3xl font-bold">{fmtCAD(s.monthly)}</span>
                <span className="text-sm font-medium text-[var(--muted)]"> / month</span>
              </p>
              <ul className="mb-7 space-y-2">
                {SIZE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent-dark)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/book?service=storage&size=${s.id}`}
                className={`${s.popular ? 'btn-primary' : 'btn-ghost'} mt-auto justify-center text-sm`}
              >
                Reserve {s.label.replace(' Space', '')}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Prepay strip */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:gap-8"
        >
          <span className="flex items-center gap-3 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
              <BadgePercent size={18} className="text-[var(--accent)]" />
            </span>
            Save more when you prepay
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[['Prepay 6 months', '5% OFF'], ['Prepay 12 months', '10% OFF']].map(([label, off]) => (
              <span key={label} className="flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--glow-soft)] px-4 py-2 text-sm">
                {label} <span className="font-bold text-[var(--accent-dark)]">{off}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Service cards */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, title, price, blurb, cta }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
                <Icon size={20} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mb-2 text-sm font-semibold text-[var(--accent-dark)]">{price}</p>
              <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">{blurb}</p>
              <Link
                href={cta.href}
                className="group mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-dark)] transition-colors hover:text-[var(--accent)]"
              >
                {cta.label}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
