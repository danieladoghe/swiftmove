'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';

interface YardSpace {
  id: string;
  tag: string;
  title: string;
  price: string;
  teaser: string;
  description: string;
  bullets: string[];
  img: string;
  span?: string;
  cta: { label: string; href: string };
}

const STORAGE_BULLETS = [
  'Secure, gated outdoor lot with drive-up access',
  'Month-to-month — no long-term contract',
  'Prepay 6 months and save 5%',
  'Prepay 12 months and save 10%',
];

const spaces: YardSpace[] = [
  {
    id: '30ft',
    tag: 'Most Popular',
    title: '30 ft Space',
    price: '$135 / month',
    teaser: 'The best-value footprint for a 2–3 bedroom home, business inventory, or a boat.',
    description:
      'Our most-reserved size. Enough room for the contents of a 2–3 bedroom home, working inventory for a small business, or a boat on its trailer — with space to walk around it.',
    bullets: STORAGE_BULLETS,
    img: '/yard-container.jpg',
    span: 'lg:col-span-2 lg:row-span-2',
    cta: { label: 'Reserve 30 ft', href: '/contact' },
  },
  {
    id: '20ft',
    tag: 'Storage',
    title: '20 ft Space',
    price: '$95 / month',
    teaser: 'Great for a 1-bedroom apartment, seasonal gear, or a small vehicle.',
    description:
      'The right size for a 1-bedroom apartment, a season of gear, or a small vehicle. Drive up, drop off, done.',
    bullets: STORAGE_BULLETS,
    img: '/yard-door.jpg',
    cta: { label: 'Reserve 20 ft', href: '/contact' },
  },
  {
    id: '40ft',
    tag: 'Storage',
    title: '40 ft Space',
    price: '$185 / month',
    teaser: 'Our largest space — perfect for an RV, trailer, or a full household.',
    description:
      'The biggest footprint in the yard. Fits an RV, a full-size trailer, or an entire household between moves — with room to spare.',
    bullets: STORAGE_BULLETS,
    img: '/yard-1.jpg',
    cta: { label: 'Reserve 40 ft', href: '/contact' },
  },
  {
    id: 'rentals',
    tag: 'Rentals',
    title: 'Equipment Rentals',
    price: 'from $75 / day',
    teaser: 'Forklifts, pallet jacks, and dollies — daily and weekly rates.',
    description:
      'Rent the muscle when you need it. Forklifts, pallet jacks, and moving dollies by the day or week, delivered to your site or picked up from the yard.',
    bullets: [
      'Daily & weekly rates with no hidden fees',
      'Delivery to your site available',
      'Certified operators on request',
      'Maintained and inspected after every rental',
    ],
    img: '/yard-forklift.jpg',
    cta: { label: 'Book Equipment', href: '/contact' },
  },
  {
    id: 'logistics',
    tag: 'Logistics',
    title: 'Freight & Logistics',
    price: 'Custom quotes',
    teaser: 'Local and long-haul freight, handled from our yard to your door.',
    description:
      'From single pallets to full truckloads, our logistics crew moves freight locally and long-haul — with GPS tracking and a dispatcher who answers the phone.',
    bullets: [
      'Local & long-haul freight',
      'GPS tracking on every load',
      'Fully insured, 12+ years running',
      'Same-week scheduling on most lanes',
    ],
    img: '/yard-truck.jpg',
    cta: { label: 'Get a Freight Quote', href: '/contact' },
  },
  {
    id: 'supplies',
    tag: 'Shop',
    title: 'Moving Supplies',
    price: 'Shop online',
    teaser: 'Boxes, wrap, tape, and kits — professional grade, shipped to your door.',
    description:
      'Everything you need to pack like a pro: double-wall boxes, bubble wrap, mattress bags, and complete moving kits — shipped to your door or picked up at the yard.',
    bullets: [
      'Double-wall boxes in every size',
      'Bundle kits for studios up to 3-bed homes',
      'Same-day pickup at the yard',
      'Bulk pricing for businesses',
    ],
    img: '/yard-6.jpg',
    cta: { label: 'Browse the Shop', href: '/shop' },
  },
];

export function YardGrid() {
  const [selected, setSelected] = useState<YardSpace | null>(null);

  return (
    <section id="yard" className="scroll-mt-20 bg-white px-4 py-24 text-gray-900 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#D97B0C] sm:text-sm">
            The Yard
          </p>
          <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Space for Every Season
          </h2>
          <p className="text-lg font-light leading-relaxed text-gray-600">
            Pick a footprint, book your gear, or hand us the whole move. Click any
            card to see details and pricing.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-[300px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space, i) => (
            <motion.button
              key={space.id}
              type="button"
              onClick={() => setSelected(space)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[24px] text-left ${space.span ?? ''}`}
            >
              <Image
                src={space.img}
                alt={space.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-x-0 bottom-0 translate-y-6 p-6 text-white transition-transform duration-500 group-hover:translate-y-0">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#FFC074]">
                  {space.tag}
                </p>
                <h3 className="text-2xl font-bold">{space.title}</h3>
                <p className="mb-2 text-sm font-semibold text-white/90">{space.price}</p>
                <p className="max-w-sm text-sm leading-relaxed text-white/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {space.teaser}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white text-gray-900 shadow-2xl md:grid-cols-2"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <X size={16} />
              </button>

              <div className="relative h-60 md:h-auto md:min-h-[420px]">
                <Image src={selected.img} alt={selected.title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              </div>

              <div className="p-8 md:p-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D97B0C]">
                  {selected.tag}
                </p>
                <h3 className="mb-1 text-3xl font-bold tracking-tight">{selected.title}</h3>
                <p className="mb-4 text-lg font-bold text-[#D97B0C]">{selected.price}</p>
                <p className="mb-6 leading-relaxed text-gray-600">{selected.description}</p>
                <ul className="mb-8 space-y-2.5">
                  {selected.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5921E]/15">
                        <Check size={12} className="text-[#D97B0C]" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={selected.cta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#F5921E] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#FFA733]"
                >
                  {selected.cta.label}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
