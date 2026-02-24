'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { useRef } from 'react';

const badges = [
  { icon: Star, text: '4.9/5 Rating' },
  { icon: Shield, text: 'Fully Insured' },
  { icon: Clock, text: '24/7 Support' },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
      id="home"
    >
      {/* Hero gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero)' }}
      />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Orb 1 */}
        <div
          className="orb-1 absolute top-[15%] right-[8%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Orb 2 */}
        <div
          className="orb-2 absolute bottom-[20%] left-[5%] w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #34d399 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Orb 3 */}
        <div
          className="orb-3 absolute top-[55%] right-[30%] w-[200px] h-[200px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {badges.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                bg-[var(--surface)] border border-[var(--border)]
                text-[var(--muted)] text-xs font-medium
                shadow-[var(--shadow)]
              "
            >
              <Icon size={12} className="text-[var(--accent)]" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight mb-6 leading-[1.1]"
        >
          Moving Made{' '}
          <span className="gradient-text">Simple,</span>
          <br />
          Stress-Free &amp;
          <br />
          <span className="gradient-text">Affordable.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          SwiftMove Co. delivers premium local and long-distance moving services across the country.
          From packing to unpacking — we handle everything so you don't have to.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/contact" className="btn-primary text-base px-7 py-3.5">
            Get a Free Quote
            <ArrowRight size={18} />
          </Link>
          <Link href="/shop" className="btn-ghost text-base px-7 py-3.5">
            Browse Our Shop
          </Link>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="
            inline-grid grid-cols-3 gap-0 divide-x divide-[var(--border)]
            bg-[var(--surface)] border border-[var(--border)]
            rounded-2xl shadow-[var(--shadow)] overflow-hidden
          "
        >
          {[
            { num: '6,000+', label: 'Moves Completed' },
            { num: '12+', label: 'Years Experience' },
            { num: '98%', label: 'Happy Customers' },
          ].map(({ num, label }) => (
            <div key={label} className="px-6 py-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent)]">{num}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[var(--accent)] opacity-50" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
