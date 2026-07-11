'use client';

import { motion, type Variants } from 'framer-motion';
import { ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

const props = [
  {
    icon: ShieldCheck,
    title: 'Fully Insured & Licensed',
    description:
      'Every move is covered by comprehensive insurance. Your belongings are protected from the moment we pick them up to the moment we set them down.',
  },
  {
    icon: Zap,
    title: 'Lightning-Fast Service',
    description:
      'Our expert crews work efficiently without cutting corners. We show up on time, every time, and get the job done faster than you expect.',
  },
  {
    icon: HeartHandshake,
    title: 'White-Glove Care',
    description:
      'We treat every item as if it were our own. From antique furniture to fragile artwork, our team uses premium materials and careful handling.',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export function ValueProps() {
  return (
    <section className="section-pad" style={{ background: 'var(--surface-2)' }} id="value-props">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
            Why Mo&apos;s Yard
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Move with Confidence
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Three principles that set us apart from every other moving company.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="glass-card p-8 group"
            >
              {/* Icon */}
              <div className="
                w-12 h-12 rounded-xl bg-[var(--glow-soft)]
                flex items-center justify-center mb-6
                group-hover:bg-[var(--accent)] group-hover:shadow-[0_0_20px_var(--glow)]
                transition-all duration-300
              ">
                <Icon size={22} className="text-[var(--accent)] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-[var(--muted)] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
