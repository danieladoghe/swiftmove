'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Check, ShoppingBag, Store, Truck } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/lib/cart';
import { GST_RATE, ACCEPTED_PAYMENTS } from '@/lib/booking';
import { COMPANY, RETURN_POLICY, DELIVERY_NOTE } from '@/lib/company';

type Fulfillment = 'pickup' | 'delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState<Fulfillment>('pickup');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ street: '', city: '', postal: '' });
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  const valid =
    contact.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    (method === 'pickup' || (address.street.trim().length > 3 && address.city.trim().length > 1));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          notes,
          fulfillment: method,
          address: method === 'delivery' ? address : undefined,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            option: i.selectedOption,
            quantity: i.quantity,
            price: i.product.price,
          })),
          subtotal,
          gst,
          total,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/shop/order-success?ref=${encodeURIComponent(data.reference)}&method=${method}`);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-20" style={{ background: 'var(--bg)' }}>
        <div className="glass-card max-w-md p-10 text-center">
          <ShoppingBag size={32} className="mx-auto mb-4 text-[var(--muted)]" />
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-sm text-[var(--muted)]">Add some supplies first — then reserve them for pickup or delivery.</p>
          <Link href="/shop" className="btn-primary justify-center">Browse the Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-5xl">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
          <ArrowLeft size={15} /> Back to shop
        </Link>
        <h1 className="mb-2 text-3xl font-bold">Reserve Your Order</h1>
        <p className="mb-10 text-[var(--muted)]">
          Pick up at the yard or get it delivered — pay when you receive it. All prices in CAD.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Fulfillment choice */}
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { id: 'pickup' as const, icon: Store, title: 'Pickup at the yard', sub: 'Free — ready during office hours' },
                { id: 'delivery' as const, icon: Truck, title: 'Local delivery', sub: 'Fee confirmed with your order' },
              ]).map(({ id, icon: Icon, title, sub }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`glass-card flex items-center gap-4 p-5 text-left ${method === id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
                >
                  <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${method === id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--glow-soft)] text-[var(--accent)]'}`}>
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-bold">{title}</span>
                    <span className="block text-xs text-[var(--muted)]">{sub}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Full name *" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="form-input" />
              <input required type="email" placeholder="Email *" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="form-input" />
            </div>
            <input type="tel" placeholder={method === 'delivery' ? "Phone (we'll confirm your delivery window) *" : "Phone (we'll text when it's ready)"} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="form-input" />

            {/* Delivery address */}
            {method === 'delivery' && (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <input required placeholder="Street address *" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="form-input" />
                <input required placeholder="City / town *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="form-input" />
                <input placeholder="Postal code" value={address.postal} onChange={(e) => setAddress({ ...address, postal: e.target.value })} className="form-input" />
              </div>
            )}

            <textarea rows={3} placeholder={method === 'delivery' ? 'Notes — gate codes, preferred delivery day, etc. (optional)' : 'Notes — preferred pickup day, substitutions, etc. (optional)'} value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input resize-none" />

            {/* Fulfillment info */}
            {method === 'pickup' ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                <p className="mb-2.5 flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  <span><span className="font-semibold">Pickup at:</span> {COMPANY.address.full}</span>
                </p>
                <p className="flex items-start gap-2.5 text-[var(--muted)]">
                  <Clock size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  Mon–Tue & Sat 12–4 · Wed–Fri 10–6 · Sun closed
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                <p className="flex items-start gap-2.5 text-[var(--muted)]">
                  <Truck size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  {DELIVERY_NOTE}
                </p>
              </div>
            )}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
              <p className="mb-1 font-semibold">Pay at {method === 'pickup' ? 'pickup' : 'delivery'}</p>
              <p className="text-[var(--muted)]">{ACCEPTED_PAYMENTS.slice(0, 3).join(' · ')} · cash</p>
            </div>

            <button type="submit" disabled={!valid || status === 'sending'} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'sending'
                ? 'Reserving…'
                : `Reserve for ${method === 'pickup' ? 'Pickup' : 'Delivery'} — ${formatPrice(total)}`} <Check size={16} />
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-500">Something went wrong — please try again or call {COMPANY.phone.display}.</p>
            )}
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">Returns:</span> {RETURN_POLICY}
            </p>
          </motion.form>

          {/* Order summary */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card h-fit p-6 lg:sticky lg:top-28"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your order</p>
            <ul className="mb-4 space-y-3 border-b border-[var(--border)] pb-4">
              {items.map((i) => (
                <li key={`${i.product.id}-${i.selectedOption ?? ''}`} className="flex items-baseline justify-between gap-3 text-sm">
                  <span>
                    {i.quantity}× {i.product.name}
                    {i.selectedOption && <span className="text-[var(--muted)]"> ({i.selectedOption})</span>}
                  </span>
                  <span className="font-semibold">{formatPrice(i.product.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-[var(--muted)]">Subtotal</span><span>{formatPrice(subtotal)}</span></p>
              <p className="flex justify-between"><span className="text-[var(--muted)]">GST (5%)</span><span>{formatPrice(gst)}</span></p>
              {method === 'delivery' && (
                <p className="flex justify-between"><span className="text-[var(--muted)]">Delivery fee</span><span className="text-[var(--muted)]">confirmed with order</span></p>
              )}
              <p className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-bold">
                <span>Due at {method === 'pickup' ? 'pickup' : 'delivery'}</span><span>{formatPrice(total)}{method === 'delivery' ? ' + delivery' : ''}</span>
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
