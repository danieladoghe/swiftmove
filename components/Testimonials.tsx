'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Homeowner, Austin TX',
    rating: 5,
    text: "SwiftMove made our cross-country relocation completely stress-free. The crew was professional, careful, and finished 2 hours ahead of schedule. Not a single item was damaged. Absolutely worth every penny.",
    initials: 'SM',
    color: '#10b981',
  },
  {
    name: 'James T.',
    role: 'Office Manager, Chicago IL',
    rating: 5,
    text: "We needed to relocate our entire 40-person office over a weekend. SwiftMove delivered on every promise — minimal downtime, zero damage, and the team was respectful of our equipment. Outstanding service.",
    initials: 'JT',
    color: '#059669',
  },
  {
    name: 'Priya R.',
    role: 'Apartment Renter, NYC',
    rating: 5,
    text: "I was nervous about moving from a 4th-floor walk-up, but the SwiftMove team handled it like pros. Fast, friendly, and their packing supplies from the shop were top-notch. I'll never use another company.",
    initials: 'PR',
    color: '#34d399',
  },
  {
    name: 'Marcus L.',
    role: 'Property Investor, Miami FL',
    rating: 5,
    text: "I've used SwiftMove for 3 different property moves now. Consistent quality every single time. The storage solution they offered between moves saved me a fortune. Highly recommend to anyone.",
    initials: 'ML',
    color: '#10b981',
  },
  {
    name: 'Emily C.',
    role: 'Family of 5, Dallas TX',
    rating: 5,
    text: "Moving with kids is chaotic, but SwiftMove took so much off our plate. They packed the entire house in one day and were so gentle with our kids' furniture. The quote was exactly what we paid — no surprises.",
    initials: 'EC',
    color: '#059669',
  },
  {
    name: 'David K.',
    role: 'Remote Worker, Seattle WA',
    rating: 5,
    text: "Booked online, got an instant quote, and the team showed up exactly on time. Everything was wrapped perfectly and nothing was scratched. Their moving boxes from the shop were also excellent quality.",
    initials: 'DK',
    color: '#34d399',
  },
];

export function Testimonials() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }} id="testimonials">
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
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Don't just take our word for it — hear from thousands of happy movers.
          </p>

          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-[var(--accent)] text-[var(--accent)]" />
            ))}
            <span className="font-bold text-lg ml-1">4.9</span>
            <span className="text-[var(--muted)]">/ 5 from 2,400+ reviews</span>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, rating, text, initials, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="glass-card p-7 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-[var(--accent)] opacity-60" />

              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-[var(--text)] text-sm leading-relaxed flex-1">
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text)]">{name}</p>
                  <p className="text-xs text-[var(--muted)]">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
