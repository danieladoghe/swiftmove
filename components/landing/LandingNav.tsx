'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

const links = [
  { label: 'The Yard', href: '#yard' },
  { label: 'Supplies', href: '#supplies' },
  { label: 'Freight', href: '#freight' },
  { label: 'Story', href: '#about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '#contact' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/40 py-4 backdrop-blur-md' : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Mo's Yard home" className="flex items-center">
            <Image
              src="/mos-yard-logo.png"
              alt="Mo's Yard — Storage, Rentals, Logistics"
              width={679}
              height={266}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="group relative text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/book"
                className="inline-block rounded-full bg-[#F5921E] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#F5921E]/25 transition-colors hover:bg-[#FFA733]"
              >
                Book Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile: theme + toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            {links.map(({ label, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-2xl font-semibold text-white/90 hover:text-white"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * links.length, duration: 0.5 }}
              className="mt-6"
            >
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#F5921E] px-8 py-3.5 text-lg font-semibold text-white"
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
