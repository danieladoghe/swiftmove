import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookingWizard } from '@/components/booking/BookingWizard';

export const metadata: Metadata = {
  title: "Book Mo's Yard | Storage, Movers & Equipment Rentals",
  description:
    'Reserve an outdoor storage space, book a moving crew by the hour, or rent equipment by the day. Instant quotes, flexible payment options.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <Suspense fallback={<div className="py-32 text-center text-[var(--muted)]">Loading booking…</div>}>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
