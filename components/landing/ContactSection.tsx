'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const details = [
  { icon: Mail, label: 'hello@mosyard.com', href: 'mailto:hello@mosyard.com' },
  { icon: Phone, label: '(555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: '123 Mover Lane, Suite 400 — Austin, TX 78701', href: undefined },
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

  const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#F5921E] focus:ring-2 focus:ring-[#F5921E]/20';

  return (
    <section id="contact" className="scroll-mt-20 bg-[#FAFAFA] px-4 py-24 text-gray-900 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#D97B0C] sm:text-sm">
            Contact
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Talk to the Yard
          </h2>
          <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-gray-600">
            Questions about a space, a rental, or a load that has to be somewhere
            by Friday? A real person answers — usually Mo.
          </p>
          <ul className="space-y-6">
            {details.map(({ icon: Icon, label, href }) => {
              const row = (
                <span className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0E1013] text-white transition-colors duration-300 group-hover:bg-[#F5921E]">
                    <Icon size={18} />
                  </span>
                  <span className="text-gray-700 transition-colors group-hover:text-[#D97B0C]">
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
          className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-2xl md:p-10"
        >
          {status === 'sent' ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5921E]/15">
                <Send size={22} className="text-[#D97B0C]" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Message received</h3>
              <p className="max-w-sm text-gray-600">
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
              <input placeholder="Subject — storage, rentals, freight…" value={form.subject} onChange={update('subject')} className={inputClasses} />
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
