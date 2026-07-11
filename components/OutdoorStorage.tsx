'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Container, Check, BadgePercent } from 'lucide-react';

interface StorageTier {
  size: string;
  price: number; // dollars per month
  blurb: string;
  features: string[];
  popular?: boolean;
}

const tiers: StorageTier[] = [
  {
    size: '20 ft',
    price: 95,
    blurb: 'Great for a 1-bedroom apartment, seasonal gear, or a small vehicle.',
    features: ['Secure, gated outdoor lot', 'Drive-up access', 'Month-to-month — no contract'],
  },
  {
    size: '30 ft',
    price: 135,
    blurb: 'Ideal for a 2–3 bedroom home, business inventory, or a boat.',
    features: ['Secure, gated outdoor lot', 'Drive-up access', 'Month-to-month — no contract'],
    popular: true,
  },
  {
    size: '40 ft',
    price: 185,
    blurb: 'Our largest space — perfect for an RV, trailer, or full household.',
    features: ['Secure, gated outdoor lot', 'Drive-up access', 'Month-to-month — no contract'],
  },
];

const prepayOffers = [
  { label: 'Prepay 6 months', discount: '5% OFF' },
  { label: 'Prepay 12 months', discount: '10% OFF' },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export function OutdoorStorage() {
  return (
    <section className="section-pad" style={{ background: 'var(--surface-2)' }} id="outdoor-storage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="
            inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase
            bg-[var(--glow-soft)] text-[var(--accent)] border border-[var(--accent)]/20 mb-4
          ">
            Outdoor Storage Space
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Room to Park, Store &amp; Stash
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Secure, gated outdoor storage with drive-up access. Pick the size that fits — no long-term commitment required.
          </p>
        </motion.div>

        {/* Pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map(({ size, price, blurb, features, popular }, i) => (
            <motion.div
              key={size}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className={`
                glass-card p-8 relative flex flex-col
                ${popular ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent),var(--shadow-lg)]' : ''}
              `}
            >
              {popular && (
                <span className="
                  absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold
                  bg-[var(--accent)] text-white shadow-[0_0_16px_var(--glow)]
                ">
                  Most Popular
                </span>
              )}

              {/* Icon */}
              <div className="
                w-12 h-12 rounded-xl bg-[var(--glow-soft)]
                flex items-center justify-center mb-6
              ">
                <Container size={22} className="text-[var(--accent)]" />
              </div>

              <h3 className="text-2xl font-bold mb-1">{size}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 flex-grow">{blurb}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[var(--text)]">${price}</span>
                <span className="text-[var(--muted)] text-sm font-medium">/ month</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--text)] text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`${popular ? 'btn-primary' : 'btn-ghost'} w-full justify-center text-sm mt-auto`}
              >
                Reserve {size}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Prepay discounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <div className="
            glass-card p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-center
            gap-5 sm:gap-10 text-center sm:text-left
          ">
            <div className="flex items-center gap-3">
              <div className="
                w-11 h-11 rounded-xl bg-[var(--glow-soft)]
                flex items-center justify-center flex-shrink-0
              ">
                <BadgePercent size={20} className="text-[var(--accent)]" />
              </div>
              <span className="font-semibold text-[var(--text)]">Save more when you prepay</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {prepayOffers.map(({ label, discount }) => (
                <div
                  key={label}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded-full
                    bg-[var(--glow-soft)] border border-[var(--accent)]/20
                  "
                >
                  <span className="text-sm text-[var(--text)] font-medium">{label}</span>
                  <span className="text-sm font-bold text-[var(--accent)]">{discount}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
