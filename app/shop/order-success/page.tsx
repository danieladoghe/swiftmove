'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 text-center glass-card p-10"
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

        <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-[var(--muted)] mb-2">
          Thank you for your purchase from SwiftMove Co.
        </p>
        <p className="text-[var(--muted)] text-sm mb-8">
          You'll receive a confirmation email shortly with your order details and tracking information.
        </p>

        <div className="
          bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)] mb-8 text-left space-y-2
        ">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Expected Delivery</span>
            <span className="font-medium">3–5 Business Days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Support</span>
            <span className="font-medium text-[var(--accent)]">hello@swiftmove.com</span>
          </div>
        </div>

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
