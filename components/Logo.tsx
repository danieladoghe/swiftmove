'use client';

import Link from 'next/link';
import { Container } from 'lucide-react';

interface LogoProps {
  /** Show the "Storage • Rentals • Logistics" tagline under the wordmark. */
  showTagline?: boolean;
  className?: string;
}

/**
 * Mo's Yard brand mark — a charcoal-plate emblem with an orange container
 * glyph, next to the two-tone "MO'S YARD" wordmark. Theme-aware: "MO'S"
 * follows the text color, "YARD" stays brand orange.
 */
export function Logo({ showTagline = false, className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Mo's Yard — Storage, Rentals, Logistics"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      {/* Emblem tile */}
      <span
        className="
          relative flex h-9 w-9 items-center justify-center rounded-lg
          bg-[#1f232a] ring-1 ring-[var(--accent)]/40
          shadow-[0_2px_10px_rgba(0,0,0,0.25)]
          transition-shadow duration-300 group-hover:shadow-[0_0_18px_var(--glow)]
        "
      >
        <Container size={19} strokeWidth={2.4} className="text-[var(--accent)]" />
      </span>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className="font-black tracking-tight text-[1.2rem]">
          <span className="text-[var(--text)]">MO&apos;S</span>
          <span className="text-[var(--accent)]"> YARD</span>
        </span>
        {showTagline && (
          <span className="mt-1.5 flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Storage <span className="text-[var(--accent)]">•</span> Rentals{' '}
            <span className="text-[var(--accent)]">•</span> Logistics
          </span>
        )}
      </span>
    </Link>
  );
}
