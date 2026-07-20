import type { Metadata } from 'next';
import { QuoteForm } from '@/components/freight/QuoteForm';

export const metadata: Metadata = {
  title: "Freight & Logistics Quote | Mo's Yard Okotoks",
  description:
    'Request a freight or logistics quote from Mo’s Yard — freight receiving, temporary storage, loading assistance, and logistics support across Okotoks, High River, Foothills County, and South Calgary.',
};

export default function FreightPage() {
  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <QuoteForm />
    </div>
  );
}
