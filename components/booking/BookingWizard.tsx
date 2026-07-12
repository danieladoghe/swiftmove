'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Warehouse, Truck, ArrowRight, ArrowLeft, Check,
  CalendarDays, Clock, MapPin, CreditCard, CheckCircle2,
} from 'lucide-react';
import {
  STORAGE_SIZES, STORAGE_TERMS, MOVER_CREWS,
  PAYMENT_OPTIONS, fmtCAD, storageQuote, moversQuote, type ServiceType,
} from '@/lib/booking';

const SERVICES = [
  { id: 'storage' as const, icon: Warehouse, title: 'Storage Space', blurb: 'Reserve a 20, 30, or 40 ft outdoor space — month-to-month or prepaid.' },
  { id: 'movers' as const, icon: Truck, title: 'Moving Crew', blurb: 'Book movers by the hour, with or without our truck.' },
];

const STEPS = ['Service', 'Details', 'Contact', 'Payment'];

const stepAnim = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};

export function BookingWizard() {
  const params = useSearchParams();

  const initialService = (['storage', 'movers'].includes(params.get('service') ?? '')
    ? params.get('service')
    : null) as ServiceType | null;
  const initialSize = ['20', '30', '40'].includes(params.get('size') ?? '') ? params.get('size')! : '30';
  const initialMonths = Number(params.get('months'));

  const [step, setStep] = useState(initialService ? 1 : 0);
  const [service, setService] = useState<ServiceType>(initialService ?? 'storage');

  // Per-service detail state
  const [storage, setStorage] = useState({
    size: initialSize,
    months: STORAGE_TERMS.some((t) => t.months === initialMonths) ? initialMonths : 1,
    date: params.get('date') ?? '',
  });
  const [movers, setMovers] = useState({ crew: 'crew-2', hours: 3, date: '', from: '', to: '' });

  const [contact, setContact] = useState({ name: '', email: '', phone: '', notes: '' });
  const [payment, setPayment] = useState<string>(PAYMENT_OPTIONS[0].id);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);

  const quote = useMemo(() => {
    if (service === 'storage') {
      const q = storageQuote(storage.size, storage.months);
      return {
        lines: [
          { k: q.size.label, v: `${fmtCAD(q.size.monthly)}/mo` },
          { k: q.term.label, v: q.term.discount ? `−${q.term.discount * 100}%` : '—' },
          ...(q.savings > 0 ? [{ k: 'Prepay savings', v: `−${fmtCAD(q.savings)}` }] : []),
        ],
        summary: `${q.size.label} · ${q.term.months} month${q.term.months > 1 ? 's' : ''}${storage.date ? ` · from ${storage.date}` : ''}`,
        total: q.total,
        totalLabel: q.term.months > 1 ? `total for ${q.term.months} months` : 'per month',
      };
    }
    const q = moversQuote(movers.crew, movers.hours);
    return {
      lines: [
        { k: q.crew.label, v: `${fmtCAD(q.crew.hourly)}/hr` },
        { k: `${q.billedHours} hours (est.)`, v: fmtCAD(q.total) },
      ],
      summary: `${q.crew.label} · ~${q.billedHours} hrs${movers.date ? ` · ${movers.date}` : ''}`,
      total: q.total,
      totalLabel: 'estimated — final billed by the hour',
    };
  }, [service, storage, movers]);

  const contactValid = contact.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

  const confirm = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          summary: quote.summary,
          total: quote.total,
          details: service === 'storage' ? storage : movers,
          contact,
          payment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReference(data.reference);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const input = 'form-input'; // themed input utility from globals.css

  /* ── Success screen ── */
  if (reference) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
        <div className="glass-card p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--glow-soft)]">
            <CheckCircle2 size={30} className="text-[var(--accent)]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Booking confirmed!</h1>
          <p className="mb-1 text-[var(--muted)]">Your reference number is</p>
          <p className="mb-6 text-2xl font-bold tracking-widest text-[var(--accent)]">{reference}</p>
          <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left text-sm">
            <p className="mb-1 font-semibold">{quote.summary}</p>
            <p className="text-[var(--muted)]">
              {fmtCAD(quote.total)} CAD · {PAYMENT_OPTIONS.find((p) => p.id === payment)?.label}
            </p>
          </div>
          <ul className="mb-8 space-y-2 text-left text-sm text-[var(--muted)]">
            <li className="flex gap-2"><Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" /> Confirmation email on its way to {contact.email}</li>
            <li className="flex gap-2"><Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" /> {payment === 'card-link' ? 'Your secure card payment link follows once the yard confirms availability.' : payment === 'invoice' ? "We'll reach out to verify your business details for invoicing." : 'Nothing due today — pay when you arrive at the yard.'}</li>
            <li className="flex gap-2"><Check size={15} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" /> Questions? Call (555) 123-4567 and mention your reference.</li>
          </ul>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary justify-center">Back to the Yard</Link>
            <Link href="/shop" className="btn-ghost justify-center">Shop moving supplies</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progress */}
      <div className="mx-auto mb-10 flex max-w-2xl items-center">
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

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Step content */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {/* STEP 0 — service */}
            {step === 0 && (
              <motion.div key="s0" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">What are we booking?</h1>
                <p className="mb-8 text-[var(--muted)]">Pick a service — you can fine-tune everything on the next step.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SERVICES.map(({ id, icon: Icon, title, blurb }) => (
                    <button
                      key={id}
                      onClick={() => { setService(id); setStep(1); }}
                      className={`glass-card p-6 text-left transition-all ${service === id ? 'border-[var(--accent)]' : ''}`}
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--glow-soft)]">
                        <Icon size={22} className="text-[var(--accent)]" />
                      </div>
                      <h3 className="mb-1.5 font-bold">{title}</h3>
                      <p className="text-sm leading-relaxed text-[var(--muted)]">{blurb}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1 — details */}
            {step === 1 && (
              <motion.div key="s1" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">
                  {service === 'storage' ? 'Pick your space' : 'Build your crew'}
                </h1>
                <p className="mb-8 text-[var(--muted)]">
                  {service === 'storage'
                    ? 'All spaces are gated, lit, and drive-up accessible.'
                    : 'Hourly rates, transparent minimums, no hidden fees.'}
                </p>

                {service === 'storage' && (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {STORAGE_SIZES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStorage({ ...storage, size: s.id })}
                          className={`glass-card relative p-5 text-left ${storage.size === s.id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
                        >
                          {s.popular && (
                            <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                              Most Popular
                            </span>
                          )}
                          <p className="font-bold">{s.label}</p>
                          <p className="mb-2 text-xl font-bold text-[var(--accent)]">
                            {fmtCAD(s.monthly)}<span className="text-xs font-medium text-[var(--muted)]"> /mo</span>
                          </p>
                          <p className="text-xs leading-relaxed text-[var(--muted)]">{s.blurb}</p>
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><CalendarDays size={14} /> Move-in date</span>
                        <input type="date" value={storage.date} onChange={(e) => setStorage({ ...storage, date: e.target.value })} className={input} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><Clock size={14} /> Term</span>
                        <select value={storage.months} onChange={(e) => setStorage({ ...storage, months: Number(e.target.value) })} className={input}>
                          {STORAGE_TERMS.map((t) => <option key={t.months} value={t.months}>{t.label}</option>)}
                        </select>
                      </label>
                    </div>
                  </div>
                )}

                {service === 'movers' && (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {MOVER_CREWS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setMovers({ ...movers, crew: c.id, hours: Math.max(movers.hours, c.minHours) })}
                          className={`glass-card relative p-5 text-left ${movers.crew === c.id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
                        >
                          {c.popular && (
                            <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                              Most Booked
                            </span>
                          )}
                          <p className="font-bold">{c.label}</p>
                          <p className="mb-2 text-xl font-bold text-[var(--accent)]">
                            {fmtCAD(c.hourly)}<span className="text-xs font-medium text-[var(--muted)]"> /hr · {c.minHours} hr min</span>
                          </p>
                          <p className="text-xs leading-relaxed text-[var(--muted)]">{c.blurb}</p>
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><CalendarDays size={14} /> Move date</span>
                        <input type="date" value={movers.date} onChange={(e) => setMovers({ ...movers, date: e.target.value })} className={input} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><Clock size={14} /> Estimated hours</span>
                        <input type="number" min={MOVER_CREWS.find((c) => c.id === movers.crew)?.minHours ?? 2} max={12} value={movers.hours}
                          onChange={(e) => setMovers({ ...movers, hours: Number(e.target.value) })} className={input} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><MapPin size={14} /> Loading at</span>
                        <input placeholder="Street address, city" value={movers.from} onChange={(e) => setMovers({ ...movers, from: e.target.value })} className={input} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"><MapPin size={14} /> Unloading at</span>
                        <input placeholder="Street address, city" value={movers.to} onChange={(e) => setMovers({ ...movers, to: e.target.value })} className={input} />
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2 — contact */}
            {step === 2 && (
              <motion.div key="s2" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">Who&apos;s booking?</h1>
                <p className="mb-8 text-[var(--muted)]">We confirm every booking personally — usually within the hour.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Full name *" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={input} />
                  <input required type="email" placeholder="Email address *" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={input} />
                  <input type="tel" placeholder="Phone (for day-of coordination)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={`${input} sm:col-span-2`} />
                  <textarea rows={4} placeholder="Anything we should know? Stairs, tight gates, fragile cargo…" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} className={`${input} resize-none sm:col-span-2`} />
                </div>
              </motion.div>
            )}

            {/* STEP 3 — payment */}
            {step === 3 && (
              <motion.div key="s3" {...stepAnim}>
                <h1 className="mb-2 text-3xl font-bold">How would you like to pay?</h1>
                <p className="mb-8 text-[var(--muted)]">
                  No charge today — every option reserves your booking now.
                </p>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPayment(p.id)}
                      className={`glass-card flex w-full items-start gap-4 p-5 text-left ${payment === p.id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
                    >
                      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${payment === p.id ? 'border-[var(--accent)]' : 'border-[var(--border)]'}`}>
                        {payment === p.id && <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />}
                      </span>
                      <span>
                        <span className="mb-0.5 flex items-center gap-2 font-bold">
                          {p.id === 'card-link' && <CreditCard size={15} className="text-[var(--accent)]" />}
                          {p.label}
                        </span>
                        <span className="block text-sm leading-relaxed text-[var(--muted)]">{p.blurb}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {status === 'error' && (
                  <p className="mt-4 text-sm text-red-500">Something went wrong — please try again or call (555) 123-4567.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          {step > 0 && (
            <div className="mt-10 flex items-center justify-between">
              <button onClick={() => setStep(step - 1)} className="btn-ghost text-sm">
                <ArrowLeft size={16} /> Back
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 2 && !contactValid}
                  className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={confirm} disabled={status === 'sending'} className="btn-primary text-sm disabled:opacity-60">
                  {status === 'sending' ? 'Confirming…' : 'Confirm Booking'} <Check size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live quote summary */}
        {step > 0 && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your quote</p>
              <div className="space-y-2.5 border-b border-[var(--border)] pb-4 text-sm">
                {quote.lines.map((l) => (
                  <div key={l.k} className="flex items-baseline justify-between gap-3">
                    <span className="text-[var(--muted)]">{l.k}</span>
                    <span className="font-semibold">{l.v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline justify-between pt-4">
                <span className="font-bold">{fmtCAD(quote.total)}</span>
                <span className="text-xs text-[var(--muted)]">{quote.totalLabel}</span>
              </div>
              <p className="mt-1 text-right text-[11px] text-[var(--muted)]">All prices in CAD</p>
              <p className="mt-3 rounded-lg bg-[var(--glow-soft)] p-3 text-xs leading-relaxed text-[var(--muted)]">
                💡 Prepay 6 months of storage for 5% off, or 12 months for 10% off — applied automatically.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
