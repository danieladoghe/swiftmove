'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface StatProps {
  end: number;
  suffix: string;
  label: string;
  prefix?: string;
  duration?: number;
}

function CountUp({ end, suffix, prefix = '', duration = 2000 }: Omit<StatProps, 'label'>) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold text-[var(--accent)]">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const stats: StatProps[] = [
  { end: 6000, suffix: '+', label: 'Moves Completed', duration: 2200 },
  { end: 12, suffix: '+', label: 'Years of Experience', duration: 1600 },
  { end: 98, suffix: '%', label: 'Customer Satisfaction', duration: 1800 },
  { end: 50, suffix: '+', label: 'Cities Served', duration: 1700 },
];

export function Stats() {
  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, var(--glow-soft) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            By the Numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Trusted by Thousands
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map(({ end, suffix, label, prefix, duration }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="
                text-center p-8 rounded-2xl
                bg-[var(--surface)] border border-[var(--border)]
                shadow-[var(--shadow)]
                hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--glow-soft)]
                transition-all duration-300
              "
            >
              <CountUp end={end} suffix={suffix} prefix={prefix ?? ''} duration={duration} />
              <p className="text-[var(--muted)] text-sm mt-3 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
