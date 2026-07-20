'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Truck, Package, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { YARD_SPACES, YARD_FEATURES, fmtCAD } from '@/lib/booking';
import { UHAUL_URL } from '@/lib/company';

const services = [
  {
    icon: Truck,
    title: 'U-Haul Rentals',
    price: 'Trucks & trailers',
    blurb: 'Book official U-Haul equipment right from our yard — customers get rental discounts and priority.',
    cta: { label: 'Book a Rental', href: UHAUL_URL, external: true },
  },
  {
    icon: Container,
    title: 'Freight & Logistics',
    price: 'Custom quotes',
    blurb: 'Freight receiving, temporary storage, loading help, and logistics support across the Foothills.',
    cta: { label: 'Request a Quote', href: '/freight', external: false },
  },
  {
    icon: Package,
    title: 'Moving Supplies',
    price: 'Reserve for pickup',
    blurb: 'Boxes, tape, covers, and gear — reserve online, pay when you pick up at the yard.',
    cta: { label: 'Reserve for Pickup', href: '/shop', external: false },
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
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -left-48 bottom-0 h-[360px] w-[360px] rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-6 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
            The Yard
          </p>
          <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Outdoor Storage in Okotoks
          </h2>
          <p className="text-lg font-light leading-relaxed text-[var(--muted)]">
            Flexible, secure outdoor storage for contractors, businesses, and
            residents. All prices in CAD + GST.
          </p>
        </motion.div>

        {/* Launch banner */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 w-fit rounded-full border border-[var(--accent)]/30 bg-[var(--glow-soft)] px-5 py-2 text-center text-sm font-semibold text-[var(--accent-dark)]"
        >
          🎉 Launch pricing — lock in your rate before regular prices kick in
        </motion.p>

        {/* Yard pricing cards */}
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {YARD_SPACES.map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
                <Container size={20} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-bold">{s.name}</h3>
              <p className="mb-3 text-sm text-[var(--muted)]">
                {s.custom ? s.dims : `${s.dims} · ${s.sqft.toLocaleString()} sq. ft.`}
              </p>
              {s.custom ? (
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
              ) : (
                <>
                  <p className="mb-1">
                    <span className="text-3xl font-bold">{fmtCAD(s.launch!)}</span>
                    <span className="text-sm font-medium text-[var(--muted)]"> / month</span>
                  </p>
                  <p className="mb-4 text-sm text-[var(--muted)]">
                    <s>{fmtCAD(s.regular!)}/mo</s>{' '}
                    <span className="font-semibold text-[var(--accent-dark)]">launch price</span>
                  </p>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
                </>
              )}
              {s.custom ? (
                <Link href="/contact" className="btn-ghost mt-auto justify-center text-sm">
                  Request a Quote
                </Link>
              ) : (
                <Link
                  href={`/book?space=${s.id}`}
                  className={`${s.id === 'contractor' ? 'btn-primary' : 'btn-ghost'} mt-auto justify-center text-sm`}
                >
                  Reserve Your Space
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Every yard includes */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-6xl rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-7"
        >
          <p className="mb-4 font-bold">Every yard includes</p>
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {YARD_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent-dark)]" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Service cards */}
        <div className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-3">
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
              <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--muted)]">{blurb}</p>
              <a
                href={cta.href}
                {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-dark)] transition-colors hover:text-[var(--accent)]"
              >
                {cta.label}
                {cta.external
                  ? <ExternalLink size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  : <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
