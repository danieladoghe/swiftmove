'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const details = [
  { icon: Mail, label: 'hello@mosyard.com', href: 'mailto:hello@mosyard.com' },
  { icon: Phone, label: '(555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: '123 Yard Road SE — Calgary, AB T2C 1A1', href: undefined },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const [firstName, ...rest] = form.name.trim().split(/\s+/);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName || 'Website',
          lastName: rest.join(' ') || '—',
          email: form.email,
          moveType: form.subject || 'Website inquiry',
          fromAddress: '—',
          toAddress: '—',
          message: form.message,
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputClasses = 'form-input text-sm';

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-[var(--bg)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -left-44 top-16 h-[400px] w-[400px] rounded-full" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
            Contact
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Talk to the Yard
          </h2>
          <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-[var(--muted)]">
            Questions about a space, a crew, or a load that has to be somewhere
            by Friday? A real person answers — usually Moyo.
          </p>
          <ul className="space-y-6">
            {details.map(({ icon: Icon, label, href }) => {
              const row = (
                <span className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] transition-colors duration-300 group-hover:bg-[#F5921E] group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <span className="transition-colors group-hover:text-[var(--accent-dark)]">
                    {label}
                  </span>
                </span>
              );
              return (
                <li key={label}>
                  {href ? <a href={href}>{row}</a> : row}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl md:p-10"
        >
          {status === 'sent' ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5921E]/15">
                <Send size={22} className="text-[var(--accent-dark)]" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Message received</h3>
              <p className="max-w-sm text-[var(--muted)]">
                Thanks for reaching out — the yard will get back to you within one
                business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" value={form.name} onChange={update('name')} className={inputClasses} />
                <input required type="email" placeholder="Email address" value={form.email} onChange={update('email')} className={inputClasses} />
              </div>
              <input placeholder="Subject — storage, movers, freight…" value={form.subject} onChange={update('subject')} className={inputClasses} />
              <textarea required rows={5} placeholder="What can we help you move or store?" value={form.message} onChange={update('message')} className={`${inputClasses} resize-none`} />
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5921E] px-7 py-4 font-semibold text-white transition-colors hover:bg-[#FFA733] disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                <Send size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
              {status === 'error' && (
                <p className="text-center text-sm text-red-600">
                  Something went wrong — please try again or email hello@mosyard.com.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
