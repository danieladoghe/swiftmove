'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<{
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
        }>;
      }>;
    };
  }
}

// ── Square Sandbox Credentials (replace with live values when ready) ──────────
const SQUARE_APP_ID = 'sandbox-sq0idb-REPLACE_WITH_YOUR_APP_ID';
const SQUARE_LOCATION_ID = 'REPLACE_WITH_YOUR_LOCATION_ID';

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const router = useRouter();
  const cardRef = useRef<{ tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }> } | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);

  const tax = Math.round(subtotal * 0.05); // GST (Alberta: 5%, no PST)
  const shipping = subtotal > 5000 ? 0 : 999;
  const total = subtotal + tax + shipping;

  // Load Square Web Payments SDK
  useEffect(() => {
    if (document.getElementById('square-sdk')) { setSdkLoaded(true); return; }
    const script = document.createElement('script');
    script.id = 'square-sdk';
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setSdkError('Failed to load payment SDK. Please refresh.');
    document.head.appendChild(script);
  }, []);

  // Initialize Square card form
  useEffect(() => {
    if (!sdkLoaded || !window.Square) return;
    let isMounted = true;

    async function initSquare() {
      try {
        const payments = await window.Square!.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const card = await payments.card();
        await card.attach('#card-container');
        if (isMounted) cardRef.current = card;
      } catch (e) {
        if (isMounted) {
          setSdkError(
            'Could not initialize payment form. This demo uses Square Sandbox — replace credentials to go live.'
          );
        }
      }
    }

    initSquare();
    return () => { isMounted = false; };
  }, [sdkLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardRef.current) {
      setPaymentMessage('Payment form not ready. Please wait.');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setPaymentMessage('');

    try {
      const result = await cardRef.current.tokenize();
      if (result.status === 'OK' && result.token) {
        // Send to our API
        const response = await fetch('/api/square/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: total,
            currency: 'CAD',
            buyerInfo: form,
            items: items.map(i => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.product.price,
              option: i.selectedOption,
            })),
          }),
        });

        const data = await response.json();

        if (data.success) {
          setPaymentStatus('success');
          setPaymentMessage(`Payment successful! Order ID: ${data.orderId}`);
          clearCart();
          setTimeout(() => router.push('/shop/order-success'), 2000);
        } else {
          throw new Error(data.error ?? 'Payment failed');
        }
      } else {
        throw new Error('Card tokenization failed. Please check your card details.');
      }
    } catch (err: unknown) {
      setPaymentStatus('error');
      setPaymentMessage(err instanceof Error ? err.message : 'Payment error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (totalItems === 0 && paymentStatus !== 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] text-sm mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-3 space-y-6">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-7"
              >
                <h2 className="font-bold text-lg mb-5">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="John"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-7"
              >
                <h2 className="font-bold text-lg mb-5">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Street Address</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="123 Main Street"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Calgary"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">State</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="TX"
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="78701"
                      value={form.zip}
                      onChange={e => setForm({ ...form, zip: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-7"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg">Payment Details</h2>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Lock size={12} className="text-[var(--accent)]" />
                    Secured by Square
                  </div>
                </div>

                {sdkError ? (
                  <div className="
                    p-4 rounded-xl border border-amber-400/40 bg-amber-400/10
                    text-amber-600 dark:text-amber-400 text-sm
                  ">
                    ⚠️ {sdkError}
                    <p className="mt-2 text-xs opacity-75">
                      To fully test payments, replace the Square credentials in the checkout page with your sandbox keys from the Square Developer Dashboard.
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      id="card-container"
                      className="
                        min-h-[90px] rounded-xl border border-[var(--border)]
                        bg-[var(--surface-2)] p-4
                      "
                    />
                    {!sdkLoaded && (
                      <p className="text-xs text-[var(--muted)] mt-2 flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin" /> Loading secure payment form...
                      </p>
                    )}
                  </>
                )}

                {/* Status message */}
                {paymentMessage && (
                  <div className={`
                    mt-4 p-3.5 rounded-xl text-sm font-medium
                    ${paymentStatus === 'success'
                      ? 'bg-[var(--glow-soft)] text-[var(--accent)] border border-[var(--accent)]/30'
                      : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }
                  `}>
                    {paymentMessage}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="glass-card p-7 sticky top-24"
              >
                <h2 className="font-bold text-lg mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map(({ product, quantity, selectedOption }) => (
                    <div key={`${product.id}-${selectedOption}`} className="flex gap-3">
                      <div className="
                        w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0
                      " style={{ background: 'var(--surface-2)' }}>
                        {product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        {selectedOption && <p className="text-xs text-[var(--muted)]">{selectedOption}</p>}
                        <p className="text-xs text-[var(--muted)]">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-semibold flex-shrink-0">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-[var(--border)] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-3 mt-3">
                    <span>Total</span>
                    <span className="text-[var(--accent)]">{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-[var(--accent)] mt-3">
                    🎉 You qualify for free shipping!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || paymentStatus === 'success'}
                  className="
                    btn-primary w-full justify-center mt-6 text-base py-3.5
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                  "
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : paymentStatus === 'success' ? (
                    '✓ Payment Complete!'
                  ) : (
                    <><Lock size={16} /> Pay {formatPrice(total)}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-[var(--muted)]">
                  <ShieldCheck size={12} className="text-[var(--accent)]" />
                  256-bit SSL encrypted payment
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
