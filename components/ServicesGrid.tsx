'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Home, MapPin, Package, Warehouse, Building2, Truck,
  Sofa, Wrench
} from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Local Moving',
    description: 'Expert local moves within your city or metro area. No hidden fees, flat-rate pricing.',
    tag: 'Most Popular',
  },
  {
    icon: MapPin,
    title: 'Long-Distance Moving',
    description: 'Cross-state and cross-country moves handled with GPS tracking and regular updates.',
    tag: null,
  },
  {
    icon: Package,
    title: 'Packing Services',
    description: 'Full and partial packing using premium materials. We pack everything, you relax.',
    tag: null,
  },
  {
    icon: Warehouse,
    title: 'Storage Solutions',
    description: 'Climate-controlled, secure storage units available short-term and long-term.',
    tag: null,
  },
  {
    icon: Building2,
    title: 'Office & Commercial',
    description: 'Minimal downtime commercial relocations with after-hours and weekend options.',
    tag: null,
  },
  {
    icon: Truck,
    title: 'Specialty Moving',
    description: 'Pianos, safes, artwork, antiques — handled by certified specialists.',
    tag: null,
  },
  {
    icon: Sofa,
    title: 'Furniture Assembly',
    description: 'Disassembly and professional reassembly of all furniture at your new location.',
    tag: null,
  },
  {
    icon: Wrench,
    title: 'Junk Removal',
    description: 'Responsible disposal and donation of items you no longer want to move.',
    tag: 'Add-on',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export function ServicesGrid() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }} id="services">
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
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Moving Services
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            From a single room to an entire office building — we have the right service for your move.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon: Icon, title, description, tag }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="glass-card p-6 group relative"
            >
              {tag && (
                <span className="
                  absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold
                  bg-[var(--accent)] text-white
                ">
                  {tag}
                </span>
              )}
              <div className="
                w-11 h-11 rounded-lg bg-[var(--glow-soft)]
                flex items-center justify-center mb-5
                group-hover:bg-[var(--accent)] group-hover:shadow-[0_0_16px_var(--glow)]
                transition-all duration-300
              ">
                <Icon size={20} className="text-[var(--accent)] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold mb-2">{title}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
