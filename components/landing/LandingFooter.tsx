'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANY, HOURS, HOURS_STATUS, UHAUL_URL } from '@/lib/company';

const explore = [
  { label: 'The Yard', href: '#yard' },
  { label: 'Shop Supplies', href: '#supplies' },
  { label: 'Freight & Logistics', href: '#freight' },
  { label: 'Our Story', href: '#about' },
  { label: 'Notes', href: '#notes' },
];

const company = [
  { label: 'Reserve Your Space', href: '/book' },
  { label: 'Request a Freight Quote', href: '/freight' },
  { label: 'Book a U-Haul', href: UHAUL_URL, external: true },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function LandingFooter() {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-[#0E1013] px-4 pb-10 pt-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand + newsletter */}
          <div>
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/mos-yard-logo.png"
                alt="Mo's Yard — Storage, Rentals, Logistics"
                width={679}
                height={266}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mb-7 max-w-xs text-sm leading-relaxed text-white/50">
              Secure outdoor storage, U-Haul rentals, moving supplies, and
              logistics support for Okotoks and surrounding communities.
            </p>
            {joined ? (
              <p className="text-sm font-medium text-[#F5921E]">
                You&apos;re on the list — see you in the yard. 🤝
              </p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setJoined(true); }}
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

          {/* Links */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">Explore</h4>
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
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">Get Started</h4>
            <ul className="space-y-3">
              {company.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm text-white/70 transition-colors hover:text-[#F5921E]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + hours */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">The Yard</h4>
            <address className="mb-5 space-y-2.5 text-sm not-italic leading-relaxed text-white/70">
              <p>
                <a href={COMPANY.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#F5921E]">
                  {COMPANY.address.line1}<br />{COMPANY.address.line2}
                </a>
              </p>
              <p><a href={`tel:${COMPANY.phone.tel}`} className="transition-colors hover:text-[#F5921E]">{COMPANY.phone.display}</a></p>
              <p><a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-[#F5921E]">{COMPANY.email}</a></p>
            </address>
            <div className="space-y-1 text-xs leading-relaxed text-white/50">
              <p className="mb-1.5 font-semibold uppercase tracking-wider text-white/40">Office hours</p>
              {HOURS_STATUS.launched ? (
                HOURS.map(({ day, hours }) => (
                  <p key={day} className="flex justify-between gap-4">
                    <span>{day}</span><span>{hours}</span>
                  </p>
                ))
              ) : (
                <p className="font-semibold text-[#F5921E]/90">{HOURS_STATUS.comingSoon}</p>
              )}
              <p className="pt-1.5 text-[#F5921E]/80">Storage customers: 24/7 gated access</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            {COMPANY.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                {...(href !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-[#F5921E]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
