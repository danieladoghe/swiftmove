'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Warehouse, Play, ArrowRight } from 'lucide-react';

const TITLE_WORDS = ['Moving', 'Made', 'Affordable', '& Simple'];

export function LandingHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100vh] min-h-[700px] items-center justify-center overflow-hidden bg-[#0E1013]">
      {/* Video background with scroll parallax */}
      <motion.div style={{ y: videoY }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          // The truck sits in the right of the 16:9 frame — bias the portrait
          // crop toward it so phones don't show only the warehouse door.
          className="h-full w-full object-cover object-[76%_center] md:object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1013] via-black/20 to-black/40" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F5921E] sm:text-sm"
        >
          <Warehouse size={16} />
          Storage &bull; Rentals &bull; Logistics
        </motion.p>

        <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-[88px]">
          {TITLE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mr-[0.25em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl"
        >
          Secure outdoor storage, U-Haul rentals, moving supplies, and freight
          support — all in one yard in Okotoks, Alberta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="/book"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 rounded-full bg-[#F5921E] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-[#F5921E]/25 transition-colors hover:bg-[#FFA733]"
          >
            Reserve Your Space
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.a
            href="#yard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-white/60 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
              <Play size={14} className="fill-white" />
            </span>
            Take the Tour
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
