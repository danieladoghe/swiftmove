// Transactional email for Mo's Yard, via Resend's REST API (no SDK dependency —
// just fetch, so it runs anywhere). Every customer submission triggers a
// notification to the yard's inbox.
//
// Best-effort by design: if RESEND_API_KEY is missing or Resend errors, we log
// and return { sent: false } instead of throwing, so a customer's order or
// enquiry is never lost because email hiccupped.
//
// Required env to switch it on (set in Netlify):
//   RESEND_API_KEY   your Resend API key
//   EMAIL_FROM       verified sender, e.g. "Mo's Yard <notifications@mosyard.ca>"
//                    (defaults to Resend's shared onboarding@resend.dev for testing)
//   EMAIL_TO         where notifications land (defaults to info@mosyard.ca)

import { env } from './env';

export interface SendResult {
  sent: boolean;
  error?: string;
  /** Human-readable detail (e.g. the Resend error message) for diagnostics. */
  detail?: string;
}

/** Non-secret view of the email configuration, for the admin diagnostics panel. */
export function emailStatus(): { configured: boolean; from: string; to: string } {
  return {
    configured: !!env('RESEND_API_KEY'),
    from: env('EMAIL_FROM') || "Mo's Yard <onboarding@resend.dev>",
    to: env('EMAIL_TO') || 'info@mosyard.ca',
  };
}

interface SendArgs {
  subject: string;
  html: string;
  replyTo?: string;
  /** Override recipient. Defaults to the yard inbox (EMAIL_TO / info@mosyard.ca). */
  to?: string;
}

export async function sendNotification({ subject, html, replyTo, to }: SendArgs): Promise<SendResult> {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email:', subject);
    return { sent: false, error: 'not_configured' };
  }
  const recipient = to || env('EMAIL_TO') || 'info@mosyard.ca';
  const from = env('EMAIL_FROM') || "Mo's Yard <onboarding@resend.dev>";

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const raw = await res.text().catch(() => '');
      let message = raw;
      try {
        message = JSON.parse(raw)?.message || raw;
      } catch {
        /* keep raw */
      }
      console.error('[email] Resend responded', res.status, raw);
      return { sent: false, error: `resend_${res.status}`, detail: message || `HTTP ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] send failed', err);
    return { sent: false, error: 'exception', detail: err instanceof Error ? err.message : 'Network error' };
  }
}

function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Build a simple, readable HTML notification email from labelled rows. */
export function notificationHtml(opts: {
  heading: string;
  intro?: string;
  reference?: string;
  rows: [label: string, value: unknown][];
}): string {
  const rows = opts.rows
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 14px 6px 0;color:#5f636b;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
           <td style="padding:6px 0;color:#17191d;font-weight:600;">${esc(value)}</td>
         </tr>`
    )
    .join('');

  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h2 style="margin:0 0 4px;color:#17191d;">${esc(opts.heading)}</h2>
    ${opts.reference ? `<p style="margin:0 0 12px;color:#d97b0c;font-weight:700;">Ref ${esc(opts.reference)}</p>` : ''}
    ${opts.intro ? `<p style="margin:0 0 16px;color:#5f636b;">${esc(opts.intro)}</p>` : ''}
    <table style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table>
    <p style="margin:20px 0 0;font-size:12px;color:#9aa0a8;">Sent automatically from mosyard.ca</p>
  </div>`;
}
