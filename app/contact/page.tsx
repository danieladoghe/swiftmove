'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';

const contactDetails = [
  { icon: Phone, label: 'Phone', value: '(555) 123-4567', href: 'tel:+15551234567' },
  { icon: Mail, label: 'Email', value: 'hello@swiftmove.com', href: 'mailto:hello@swiftmove.com' },
  { icon: MapPin, label: 'Headquarters', value: '123 Mover Lane, Suite 400\nAustin, TX 78701', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 7am–8pm\nSat–Sun: 8am–5pm', href: '#' },
];

const moveTypes = [
  'Local Move (same city)',
  'Long-Distance Move (different state)',
  'Office / Commercial Move',
  'Storage Only',
  'Packing Services Only',
  'Other',
];

const roomCounts = ['Studio / 1 Room', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms', 'Office Space'];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  moveType: string;
  rooms: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    moveType: '', rooms: '', fromAddress: '', toAddress: '',
    moveDate: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to send. Please try again.');
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="py-16 border-b border-[var(--border)] relative overflow-hidden" style={{ background: 'var(--surface-2)' }}>
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-[var(--glow-soft)] text-[var(--accent)] border border-[var(--accent)]/20 mb-4"
          >
            Get a Free Quote
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Let's Plan Your <span className="gradient-text">Perfect Move</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-lg max-w-xl mx-auto"
          >
            Fill out the form below and we'll get back to you with a detailed quote within 2 business hours.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info sidebar */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-5">Contact Information</h2>
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="
                    flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                    hover:border-[var(--accent)] hover:shadow-[0_0_16px_var(--glow-soft)]
                    transition-all duration-200 mb-3 group
                  "
                >
                  <div className="
                    w-10 h-10 rounded-lg bg-[var(--glow-soft)] flex items-center justify-center flex-shrink-0
                    group-hover:bg-[var(--accent)] transition-colors duration-200
                  ">
                    <Icon size={18} className="text-[var(--accent)] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] font-medium mb-0.5">{label}</p>
                    <p className="text-sm text-[var(--text)] font-medium whitespace-pre-line">{value}</p>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="
                rounded-2xl border border-[var(--border)] overflow-hidden
                bg-[var(--surface)] h-52 flex items-center justify-center
                text-[var(--muted)] text-sm
              "
            >
              <div className="text-center">
                <MapPin size={32} className="text-[var(--accent)] mx-auto mb-2 opacity-60" />
                <p className="font-medium">123 Mover Lane, Austin TX</p>
                <p className="text-xs mt-1">Replace with Google Maps embed</p>
              </div>
            </motion.div>
          </div>

          {/* Quote form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8"
            >
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="
                    w-16 h-16 rounded-full bg-[var(--glow-soft)] border-2 border-[var(--accent)]
                    flex items-center justify-center mx-auto mb-5
                    shadow-[0_0_24px_var(--glow)]
                  ">
                    <CheckCircle2 size={28} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Quote Request Sent!</h3>
                  <p className="text-[var(--muted)] mb-2">
                    We've received your request and will respond within 2 business hours.
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Check your inbox at <span className="text-[var(--accent)]">{form.email}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold mb-1">Request a Free Quote</h2>
                  <p className="text-[var(--muted)] text-sm mb-6">All fields marked * are required.</p>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">First Name *</label>
                      <input type="text" required className="form-input" placeholder="John" value={form.firstName} onChange={update('firstName')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Last Name *</label>
                      <input type="text" required className="form-input" placeholder="Doe" value={form.lastName} onChange={update('lastName')} />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Email *</label>
                      <input type="email" required className="form-input" placeholder="john@email.com" value={form.email} onChange={update('email')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Phone</label>
                      <input type="tel" className="form-input" placeholder="(555) 000-0000" value={form.phone} onChange={update('phone')} />
                    </div>
                  </div>

                  {/* Move type + rooms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Type of Move *</label>
                      <select required className="form-input" value={form.moveType} onChange={update('moveType')}>
                        <option value="">Select move type</option>
                        {moveTypes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Home Size</label>
                      <select className="form-input" value={form.rooms} onChange={update('rooms')}>
                        <option value="">Select size</option>
                        {roomCounts.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Moving From (City/State) *</label>
                    <input type="text" required className="form-input" placeholder="Austin, TX" value={form.fromAddress} onChange={update('fromAddress')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Moving To (City/State) *</label>
                    <input type="text" required className="form-input" placeholder="Dallas, TX" value={form.toAddress} onChange={update('toAddress')} />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Target Move Date</label>
                    <input type="date" className="form-input" value={form.moveDate} onChange={update('moveDate')} />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Additional Details</label>
                    <textarea
                      rows={4}
                      className="form-input resize-none"
                      placeholder="Any special items, access restrictions, floor numbers, etc."
                      value={form.message}
                      onChange={update('message')}
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Quote Request</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
