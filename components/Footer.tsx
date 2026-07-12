'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

const footerLinks = {
  Services: [
    { label: 'The Yard', href: '/#yard' },
    { label: 'Reserve Storage', href: '/book?service=storage' },
    { label: 'Book Movers', href: '/book?service=movers' },
    { label: 'Freight & Logistics', href: '/contact' },
  ],
  Shop: [
    { label: 'Moving Boxes', href: '/shop' },
    { label: 'Packing Supplies', href: '/shop' },
    { label: 'Moving Gear', href: '/shop' },
    { label: 'Bundle Kits', href: '/shop' },
  ],
  Company: [
    { label: 'Notes from the Yard', href: '/#notes' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)]"
      style={{ background: 'var(--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Logo heightClass="h-16" />
            </div>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-xs">
              Secure outdoor storage, movers, logistics, and moving supplies —
              a young yard with an old-school promise.
            </p>
            {/* Contact info */}
            <div className="space-y-2.5">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Phone size={14} />
                (555) 123-4567
              </a>
              <a
                href="mailto:hello@mosyard.com"
                className="flex items-center gap-2.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Mail size={14} />
                hello@mosyard.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>123 Yard Road SE<br />Calgary, AB T2C 1A1</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-[var(--text)] mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="
          py-6 border-t border-[var(--border)]
          flex flex-col sm:flex-row items-center justify-between gap-4
        ">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Mo&apos;s Yard. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="
                  w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]
                  flex items-center justify-center text-[var(--muted)]
                  hover:text-[var(--accent)] hover:border-[var(--accent)]
                  hover:shadow-[0_0_12px_var(--glow-soft)]
                  transition-all duration-200
                "
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
