'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, CalendarDays, CheckCircle2, FileText, ExternalLink,
} from 'lucide-react';
import { YARD_SPACES, YARD_FEATURES, ACCEPTED_PAYMENTS, fmtCAD, yardQuote } from '@/lib/booking';
import { COMPANY } from '@/lib/company';

const STEPS = ['Space', 'Contact', 'Confirm'];

const stepAnim = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};

export function BookingWizard() {
  const params = useSearchParams();
  const initialSpace = YARD_SPACES.some((s) => s.id === params.get('space') && !s.custom)
    ? params.get('space')!
    : 'contractor';

  const [step, setStep] = useState(0);
  const [spaceId, setSpaceId] = useState(initialSpace);
  const [moveIn, setMoveIn] = useState(params.get('date') ?? '');
  const [notes, setNotes] = useState('');
  const [contact, setContact] = useState({ name: '', company: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [result, setResult] = useState<{ reference: string; invoiced: boolean; invoiceUrl?: string | null } | null>(null);

  const quote = useMemo(() => yardQuote(spaceId), [spaceId]);
  const contactValid = contact.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

  const confirm = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId, moveIn, notes, contact }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ reference: data.reference, invoiced: data.invoiced, invoiceUrl: data.invoiceUrl });
        setStatus('idle');
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const input = 'form-input';

  /* ── Success ── */
  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
        <div className="glass-card p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--glow-soft)]">
            <CheckCircle2 size={30} className="text-[var(--accent)]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Reservation received!</h1>
          <p className="mb-1 text-[var(--muted)]">Your reference number is</p>
          <p className="mb-6 text-2xl font-bold tracking-widest text-[var(--accent)]">{result.reference}</p>
          <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left text-sm">
            <p className="mb-1 font-semibold">
              {quote.space.name} ({quote.space.dims}){moveIn ? ` · move-in ${moveIn}` : ''}
            </p>
            <p className="text-[var(--muted)]">
              First month {fmtCAD(quote.monthly)} + GST = {fmtCAD(quote.firstInvoiceTotal)} CAD
            </p>
          </div>
          <ul className="mb-8 space-y-2.5 text-left text-sm text-[var(--muted)]">
            <li className="flex gap-2">
              <FileText size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
              {result.invoiced
                ? `Your invoice with a secure payment link is on its way to ${contact.email}.`
                : `We'll email your invoice with a secure payment link to ${contact.email} shortly.`}
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
              Your space is confirmed once payment and the signed rental agreement are received. Security
              deposit and administration fee (if applicable) are outlined in the rental agreement.
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
              Questions? Call{' '}
              <a href={`tel:${COMPANY.phone.tel}`} className="font-semibold text-[var(--accent)]">
                {COMPANY.phone.display}
              </a>{' '}
              and mention your reference.
            </li>
          </ul>
          {result.invoiceUrl && (
            <a
              href={result.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mb-4 w-full justify-center"
            >
              View & Pay Invoice <ExternalLink size={15} />
            </a>
          )}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-ghost justify-center">Back to the Yard</Link>
            <Link href="/shop" className="btn-ghost justify-center">Shop moving supplies</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progress */}
      <div className="mx-auto mb-10 flex max-w-md items-center">
        {STEPS.map((label, i) => (
          <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 ${
                  i < step
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : i === step
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium ${i <= step ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 mb-5 h-0.5 flex-1 rounded ${i < step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {/* STEP 0 — space + date */}
            {step === 0 && (
              <motion.div key="s0" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">Reserve your space</h1>
                <p className="mb-8 text-[var(--muted)]">
                  Every yard includes 24/7 gated access, cameras, LED lighting, and snow removal.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {YARD_SPACES.filter((s) => !s.custom).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSpaceId(s.id)}
                      className={`glass-card relative p-5 text-left ${spaceId === s.id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
                    >
                      <p className="font-bold">{s.name}</p>
                      <p className="text-xs text-[var(--muted)]">{s.dims} · {s.sqft.toLocaleString()} sq. ft.</p>
                      <p className="mt-2 text-xl font-bold text-[var(--accent)]">
                        {fmtCAD(s.launch!)}<span className="text-xs font-medium text-[var(--muted)]"> /mo launch</span>
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        <s>{fmtCAD(s.regular!)}/mo</s> regular
                      </p>
                    </button>
                  ))}
                  <Link
                    href="/contact"
                    className="glass-card flex flex-col justify-center p-5 text-left"
                  >
                    <p className="font-bold">Custom Contractor Yard</p>
                    <p className="text-xs text-[var(--muted)]">1,500+ sq. ft. — tailored to you</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-dark)]">
                      Request a Quote <ArrowRight size={14} />
                    </p>
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><CalendarDays size={14} /> Preferred move-in date</span>
                    <input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={input} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">What are you storing? (optional)</span>
                    <input placeholder="e.g. work truck + enclosed trailer" value={notes} onChange={(e) => setNotes(e.target.value)} className={input} />
                  </label>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — contact */}
            {step === 1 && (
              <motion.div key="s1" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">Who&apos;s reserving?</h1>
                <p className="mb-8 text-[var(--muted)]">
                  Your invoice and rental agreement go to this email.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Full name *" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={input} />
                  <input placeholder="Company (optional)" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} className={input} />
                  <input required type="email" placeholder="Email address *" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={input} />
                  <input type="tel" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={input} />
                </div>
              </motion.div>
            )}

            {/* STEP 2 — review & confirm */}
            {step === 2 && (
              <motion.div key="s2" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">Review & confirm</h1>
                <p className="mb-8 text-[var(--muted)]">Here&apos;s how your reservation works:</p>
                <ol className="mb-8 space-y-4">
                  {[
                    `We email an invoice for your first month (${fmtCAD(quote.monthly)} + GST) with a secure online payment link.`,
                    'Pay the invoice, then sign the rental agreement we send along with it (deposit and admin fee, if applicable, are outlined there).',
                    'Once payment and the signed agreement are in, your space is confirmed and your gate access is activated.',
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--glow-soft)] text-sm font-bold text-[var(--accent)]">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ol>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                  <p className="mb-1.5 font-semibold">Accepted payment methods</p>
                  <p className="text-[var(--muted)]">{ACCEPTED_PAYMENTS.join(' · ')}</p>
                </div>
                {status === 'error' && (
                  <p className="mt-4 text-sm text-red-500">
                    Something went wrong — please try again or call {COMPANY.phone.display}.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav */}
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-ghost text-sm">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <span />}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !contactValid}
                className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={confirm} disabled={status === 'sending'} className="btn-primary text-sm disabled:opacity-60">
                {status === 'sending' ? 'Reserving…' : 'Reserve & Send My Invoice'} <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quote summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-card p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your reservation</p>
            <div className="space-y-2.5 border-b border-[var(--border)] pb-4 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--muted)]">{quote.space.name} ({quote.space.dims})</span>
                <span className="font-semibold">{fmtCAD(quote.monthly)}/mo</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--muted)]">Regular price</span>
                <span className="text-[var(--muted)]"><s>{fmtCAD(quote.regular)}/mo</s></span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--muted)]">Launch savings</span>
                <span className="font-semibold text-[var(--accent-dark)]">−{fmtCAD(quote.savings)}/mo</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--muted)]">GST (5%)</span>
                <span className="font-semibold">{fmtCAD(quote.gst)}</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-4">
              <span className="font-bold">{fmtCAD(quote.firstInvoiceTotal)}</span>
              <span className="text-xs text-[var(--muted)]">first-month invoice · CAD</span>
            </div>
            <ul className="mt-4 space-y-1.5 rounded-lg bg-[var(--glow-soft)] p-3 text-xs leading-relaxed text-[var(--muted)]">
              {YARD_FEATURES.slice(0, 5).map((f) => (
                <li key={f} className="flex gap-1.5"><Check size={12} className="mt-0.5 flex-shrink-0 text-[var(--accent-dark)]" />{f}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
