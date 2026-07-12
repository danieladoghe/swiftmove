'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const explore = [
  { label: 'The Yard', href: '#yard' },
  { label: 'Shop Supplies', href: '#supplies' },
  { label: 'Get a Quote', href: '#quote' },
  { label: 'Notes', href: '#notes' },
];

const company = [
  { label: 'Book Now', href: '/book' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
];

const socials = ['Instagram', 'Twitter', 'Facebook'];

export function LandingFooter() {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-[#0E1013] px-4 pb-10 pt-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand + newsletter */}
          <div>
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/mos-yard-logo.png"
                alt="Mo's Yard — Storage, Rentals, Logistics"
                width={1124}
                height={423}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mb-7 max-w-xs text-sm leading-relaxed text-white/50">
              A young yard with an old-school promise — storage, movers, logistics,
              and supplies, handled like they&apos;re our own.
            </p>
            {joined ? (
              <p className="text-sm font-medium text-[#F5921E]">
                You&apos;re on the list — see you in the yard. 🤝
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setJoined(true);
                }}
                className="flex max-w-sm items-center rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-md"
              >
                <input
                  required
                  type="email"
                  placeholder="Email for yard news"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder-white/40 outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-full bg-[#F5921E] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FFA733]"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Link columns */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              Explore
            </h4>
            <ul className="space-y-3">
              {explore.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 transition-colors hover:text-[#F5921E]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              Company
            </h4>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 transition-colors hover:text-[#F5921E]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact text */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              The Yard
            </h4>
            <address className="space-y-3 text-sm not-italic leading-relaxed text-white/70">
              <p>123 Yard Road SE<br />Calgary, AB T2C 1A1</p>
              <p>
                <a href="tel:+15551234567" className="transition-colors hover:text-[#F5921E]">(555) 123-4567</a>
              </p>
              <p>
                <a href="mailto:hello@mosyard.com" className="transition-colors hover:text-[#F5921E]">hello@mosyard.com</a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mo&apos;s Yard. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-[#F5921E]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
