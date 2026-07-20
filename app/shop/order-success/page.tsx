'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { COMPANY, RETURN_POLICY } from '@/lib/company';

function OrderSuccessContent() {
  const params = useSearchParams();
  const ref = params.get('ref');

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 my-12 text-center glass-card p-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, damping: 15 }}
          className="
            w-20 h-20 rounded-full bg-[var(--glow-soft)] border-2 border-[var(--accent)]
            flex items-center justify-center mx-auto mb-6
            shadow-[0_0_32px_var(--glow)]
          "
        >
          <CheckCircle2 size={36} className="text-[var(--accent)]" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-3">Reserved for Pickup!</h1>
        {ref && (
          <p className="mb-2 text-xl font-bold tracking-widest text-[var(--accent)]">{ref}</p>
        )}
        <p className="text-[var(--muted)] text-sm mb-8">
          Your supplies are set aside at the yard — pay when you pick up
          (credit, debit, or e-transfer).
        </p>

        <div className="
          bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)] mb-6 text-left space-y-3
        ">
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
            <span className="font-medium">{COMPANY.address.full}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <Clock size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
            <span className="text-[var(--muted)]">
              Mon–Tue & Sat 12–4 · Wed–Fri 10–6 · Sun closed
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Questions</span>
            <a href={`mailto:${COMPANY.email}`} className="font-medium text-[var(--accent)]">{COMPANY.email}</a>
          </div>
        </div>

        <p className="mb-8 text-left text-xs leading-relaxed text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">Returns:</span> {RETURN_POLICY}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/shop" className="btn-primary w-full justify-center">
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link href="/" className="btn-ghost w-full justify-center text-sm">
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
