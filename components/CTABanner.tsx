'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="section-pad relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
        }}
      />
      {/* Soft edge glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Decorative orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Ready to Make Your Move?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Get a free, no-obligation quote in under 2 minutes. Our team is standing by to make your next move the easiest one yet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="
                flex items-center gap-2 px-8 py-4 rounded-xl
                bg-white text-[var(--accent-dark)] font-bold text-base
                hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                hover:-translate-y-1 transition-all duration-200
              "
            >
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:+15551234567"
              className="
                flex items-center gap-2 px-8 py-4 rounded-xl
                bg-white/10 text-white font-semibold text-base border border-white/30
                hover:bg-white/20 hover:-translate-y-1 transition-all duration-200
              "
            >
              <Phone size={18} />
              (555) 123-4567
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
