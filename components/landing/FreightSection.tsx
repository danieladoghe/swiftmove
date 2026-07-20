'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, FileText, MapPin, Check } from 'lucide-react';
import { COMPANY, SERVICE_AREA } from '@/lib/company';

const services = [
  'Freight receiving',
  'Temporary storage',
  'Loading & unloading assistance',
  'Logistics support for businesses',
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
} as const;

export function FreightSection() {
  return (
    <section id="freight" className="relative scroll-mt-20 overflow-hidden bg-[var(--bg)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -right-44 top-16 h-[400px] w-[400px] rounded-full" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div {...fadeUp} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
            Freight & Logistics
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            From Our Yard to Your Door
          </h2>
          <p className="mb-7 text-lg font-light leading-relaxed text-[var(--muted)]">
            We provide freight receiving, temporary storage, loading and unloading
            assistance, and logistics support for businesses throughout Okotoks
            and surrounding communities.
          </p>
          <ul className="mb-8 space-y-3">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--glow-soft)]">
                  <Check size={14} className="text-[var(--accent-dark)]" />
                </span>
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="mb-3 flex items-center gap-2 font-bold">
              <MapPin size={16} className="text-[var(--accent)]" /> Service Area
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {SERVICE_AREA.primary.map((area) => (
                <span key={area} className="rounded-full border border-[var(--accent)]/25 bg-[var(--glow-soft)] px-3.5 py-1.5 text-sm font-medium">
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">Extended area:</span> {SERVICE_AREA.extended}
            </p>
          </div>
        </motion.div>

        {/* Three ways to get a quote */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <p className="text-lg font-bold">Need a freight quote?</p>
          {[
            { icon: Phone, title: 'Call us', sub: COMPANY.phone.display, href: `tel:${COMPANY.phone.tel}`, external: false },
            { icon: Mail, title: 'Email us', sub: COMPANY.email, href: `mailto:${COMPANY.email}`, external: false },
            { icon: FileText, title: 'Request a quote online', sub: 'Tell us about your freight — customized quote within one business day', href: '/freight', external: false },
          ].map(({ icon: Icon, title, sub, href }) => (
            <a
              key={title}
              href={href}
              className="group flex items-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:shadow-xl"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--glow-soft)] transition-colors group-hover:bg-[var(--accent)]">
                <Icon size={20} className="text-[var(--accent)] transition-colors group-hover:text-white" />
              </span>
              <span>
                <span className="block font-bold">{title}</span>
                <span className="block text-sm text-[var(--muted)]">{sub}</span>
              </span>
            </a>
          ))}
          <p className="mt-2 rounded-lg bg-[var(--glow-soft)] p-4 text-sm leading-relaxed text-[var(--muted)]">
            We&apos;ll review your request and provide a customized quote within one
            business day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
