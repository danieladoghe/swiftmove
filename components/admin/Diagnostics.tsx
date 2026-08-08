'use client';

import { useState } from 'react';

interface Props {
  email: { configured: boolean; from: string; to: string };
  database: { configured: boolean; ok: boolean; error?: string };
  square: { configured: boolean; env: string };
}

const c = { border: '#2a2e35', surface: '#181b20', text: '#f2f0ec', muted: '#9aa0a8', accent: '#f5921e' };

function Pill({ ok, label, warn }: { ok: boolean; label: string; warn?: boolean }) {
  const color = ok ? '#3ecf8e' : warn ? '#f5b942' : '#ff6b6b';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

export function Diagnostics({ email, database, square }: Props) {
  const [to, setTo] = useState(email.to);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      });
      const data = await res.json();
      if (data.sent) {
        setResult({ ok: true, msg: `Sent to ${data.to}. Check the inbox (and spam).` });
      } else if (data.error === 'not_configured') {
        setResult({ ok: false, msg: 'RESEND_API_KEY is not set in Netlify — email can’t send yet.' });
      } else {
        setResult({ ok: false, msg: `Failed (${data.error}): ${data.detail || 'no detail'}` });
      }
    } catch {
      setResult({ ok: false, msg: 'Request failed.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <details style={{ margin: '18px 0 4px', border: `1px solid ${c.border}`, borderRadius: 12, background: c.surface, padding: '12px 16px' }}>
      <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 600, color: c.text }}>
        Diagnostics &amp; test email
      </summary>

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '14px 0' }}>
        <Pill ok={email.configured} warn label={`Email: ${email.configured ? 'key set' : 'not configured'}`} />
        <Pill ok={database.ok} label={`Database: ${database.configured ? (database.ok ? 'connected' : 'error') : 'not configured'}`} />
        <Pill ok={square.configured} warn label={`Square: ${square.configured ? `${square.env}` : 'not configured'}`} />
      </div>

      <div style={{ fontSize: 12.5, color: c.muted, marginBottom: 14, lineHeight: 1.6 }}>
        <div>Sending from: <code style={{ color: c.text }}>{email.from}</code></div>
        <div>Yard inbox: <code style={{ color: c.text }}>{email.to}</code></div>
        {database.error && <div style={{ color: '#ff8f8f' }}>DB: {database.error}</div>}
        {!email.configured && (
          <div style={{ color: '#f5b942', marginTop: 4 }}>
            Set <code>MOS_RESEND_API_KEY</code> + verify the mosyard.ca domain in Resend, then redeploy.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="test recipient"
          style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${c.border}`, background: '#0e1013', color: c.text, fontSize: 13, minWidth: 220 }}
        />
        <button
          onClick={sendTest}
          disabled={sending}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: c.accent, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: sending ? 0.6 : 1 }}
        >
          {sending ? 'Sending…' : 'Send test email'}
        </button>
      </div>
      {result && (
        <p style={{ marginTop: 10, fontSize: 13, color: result.ok ? '#3ecf8e' : '#ff8f8f' }}>{result.msg}</p>
      )}
    </details>
  );
}
