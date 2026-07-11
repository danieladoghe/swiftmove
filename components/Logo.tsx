'use client';

import Image from 'next/image';
import Link from 'next/link';

const SOURCES = {
  full: { src: '/mos-yard-logo.png', width: 1124, height: 423 },
  wordmark: { src: '/mos-yard-wordmark.png', width: 1088, height: 214 },
} as const;

interface LogoProps {
  /** "wordmark" is the compact MO'S YARD plate (navbar); "full" includes the yard scene (footer/hero). */
  variant?: keyof typeof SOURCES;
  className?: string;
  /** Tailwind height class controlling the rendered logo size (width stays auto). */
  heightClass?: string;
  /** Eager-load for above-the-fold placements like the navbar. */
  priority?: boolean;
}

/**
 * Mo's Yard brand mark — the official logo with its background knocked out to
 * transparent, so it sits cleanly on both light and dark themes.
 */
export function Logo({ variant = 'full', className = '', heightClass = 'h-10', priority = false }: LogoProps) {
  const { src, width, height } = SOURCES[variant];
  return (
    <Link
      href="/"
      aria-label="Mo's Yard — Storage, Rentals, Logistics"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={src}
        alt="Mo's Yard — Storage, Rentals, Logistics"
        width={width}
        height={height}
        priority={priority}
        className={`${heightClass} w-auto`}
      />
    </Link>
  );
}
