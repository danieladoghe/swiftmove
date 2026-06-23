'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Truck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/#outdoor-storage', label: 'Storage' },
  { href: '/#about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-[var(--navbar-bg)] backdrop-blur-md border-b border-[var(--border)] shadow-[var(--shadow)]'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="
                w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center
                group-hover:shadow-[0_0_16px_var(--glow)] transition-shadow duration-300
              ">
                <Truck size={18} className="text-white" />
              </div>
              <span className="font-bold text-[1.15rem] text-[var(--text)] tracking-tight">
                Swift<span className="text-[var(--accent)]">Move</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${pathname === href || (href !== '/' && pathname.startsWith(href))
                      ? 'text-[var(--accent)] bg-[var(--glow-soft)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }
                  `}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side: theme toggle + CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/contact" className="btn-primary text-sm py-2 px-4">
                Get a Free Quote
              </Link>
            </div>

            {/* Mobile: theme + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="
                  flex items-center justify-center w-9 h-9 rounded-lg
                  border border-[var(--border)] bg-[var(--surface)]
                  text-[var(--muted)] hover:text-[var(--accent)]
                  transition-all duration-200
                "
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="
              fixed top-16 left-0 right-0 z-40 overflow-hidden
              bg-[var(--surface)] border-b border-[var(--border)]
              shadow-[var(--shadow-lg)] md:hidden
            "
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${pathname === href
                      ? 'text-[var(--accent)] bg-[var(--glow-soft)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }
                  `}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[var(--border)] mt-1">
                <Link href="/contact" className="btn-primary w-full justify-center text-sm">
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
