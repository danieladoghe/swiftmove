import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={15} /> Back to home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: {updated}</p>
        <p className="mt-6 text-[var(--muted)] leading-relaxed">{intro}</p>
        <div className="legal-prose mt-10 space-y-9">{children}</div>
      </div>
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold tracking-tight">{heading}</h2>
      <div className="space-y-3 leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}
