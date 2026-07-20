'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, CheckCircle2, MapPin } from 'lucide-react';
import { COMPANY, SERVICE_AREA } from '@/lib/company';

const SERVICES = [
  'Freight receiving',
  'Temporary storage',
  'Loading / unloading assistance',
  'Delivery / transport',
  'Ongoing logistics support',
  'Other',
];

export function QuoteForm() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    service: SERVICES[0], pickup: '', delivery: '', date: '', description: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [reference, setReference] = useState('');

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) { setReference(data.reference); setStatus('sent'); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const input = 'form-input';

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
        <div className="glass-card p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--glow-soft)]">
            <CheckCircle2 size={30} className="text-[var(--accent)]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Quote request received</h1>
          <p className="mb-1 text-[var(--muted)]">Your reference number is</p>
          <p className="mb-6 text-2xl font-bold tracking-widest text-[var(--accent)]">{reference}</p>
          <p className="mb-8 text-[var(--muted)]">
            We&apos;ll review your request and provide a customized quote within one
            business day. Have photos of your freight? Email them to{' '}
            <a href={`mailto:${COMPANY.email}`} className="font-semibold text-[var(--accent)]">{COMPANY.email}</a>{' '}
            with your reference number.
          </p>
          <Link href="/" className="btn-primary justify-center">Back to the Yard</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
      {/* Form */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
          Freight & Logistics
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Request a Quote</h1>
        <p className="mb-8 max-w-xl text-[var(--muted)]">
          Freight receiving, temporary storage, loading and unloading assistance,
          and logistics support for businesses throughout Okotoks and surrounding
          communities.
        </p>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="Name *" value={form.name} onChange={update('name')} className={input} />
          <input placeholder="Company" value={form.company} onChange={update('company')} className={input} />
          <input required type="email" placeholder="Email *" value={form.email} onChange={update('email')} className={input} />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={update('phone')} className={input} />
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Service needed</span>
            <select value={form.service} onChange={update('service')} className={input}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <input placeholder="Pickup location" value={form.pickup} onChange={update('pickup')} className={input} />
          <input placeholder="Delivery location" value={form.delivery} onChange={update('delivery')} className={input} />
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Preferred date</span>
            <input type="date" value={form.date} onChange={update('date')} className={input} />
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe your freight — what is it, roughly how big/heavy, and anything we should know *"
            value={form.description}
            onChange={update('description')}
            className={`${input} resize-none sm:col-span-2`}
          />
          <p className="text-xs text-[var(--muted)] sm:col-span-2">
            Photos help! After submitting, you can email photos to {COMPANY.email} with your reference number.
          </p>
          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary justify-center sm:col-span-2 disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Request My Quote'} <Send size={16} />
          </motion.button>
          {status === 'error' && (
            <p className="text-sm text-red-500 sm:col-span-2">
              Something went wrong — please try again or call {COMPANY.phone.display}.
            </p>
          )}
        </form>
      </div>

      {/* Sidebar: other ways + service area */}
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <a href={`tel:${COMPANY.phone.tel}`} className="glass-card flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
            <Phone size={18} className="text-[var(--accent)]" />
          </span>
          <span>
            <span className="block text-sm font-bold">Call us</span>
            <span className="block text-sm text-[var(--muted)]">{COMPANY.phone.display}</span>
          </span>
        </a>
        <a href={`mailto:${COMPANY.email}`} className="glass-card flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
            <Mail size={18} className="text-[var(--accent)]" />
          </span>
          <span>
            <span className="block text-sm font-bold">Email us</span>
            <span className="block text-sm text-[var(--muted)]">{COMPANY.email}</span>
          </span>
        </a>
        <div className="glass-card p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold">
            <MapPin size={15} className="text-[var(--accent)]" /> Primary service area
          </p>
          <ul className="mb-3 space-y-1.5 text-sm text-[var(--muted)]">
            {SERVICE_AREA.primary.map((a) => <li key={a}>• {a}</li>)}
          </ul>
          <p className="text-xs leading-relaxed text-[var(--muted)]">{SERVICE_AREA.extended}</p>
        </div>
        <p className="rounded-lg bg-[var(--glow-soft)] p-4 text-xs leading-relaxed text-[var(--muted)]">
          We&apos;ll review your request and provide a customized quote within one business day.
        </p>
      </aside>
    </div>
  );
}
