'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CalendarDays, Headphones } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Gated & Guarded',
    text: 'Fenced, lit, and monitored around the clock.',
  },
  {
    icon: Truck,
    title: 'Drive-Up Access',
    text: 'Pull your rig right up to your space.',
  },
  {
    icon: CalendarDays,
    title: 'Month-to-Month',
    text: 'No contracts. Prepay 6 or 12 months and save.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    text: 'A real person from the yard, any hour.',
  },
];

export function FeatureBar() {
  return (
    <section className="bg-[#0E1013] px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-[24px] border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map(({ icon: Icon, title, text }) => (
          <motion.div key={title} whileHover={{ y: -5 }} className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Icon size={22} className="text-[#F5921E]" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
