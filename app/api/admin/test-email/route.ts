import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-auth';
import { sendNotification, notificationHtml, emailStatus } from '@/lib/email';

// Sends a test email through the exact same path real notifications use, and
// returns the precise result (including any Resend error message) so email
// delivery can be diagnosed from the dashboard. Auth-checked here directly.
export async function POST(req: NextRequest) {
  const user = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { to } = emailStatus();
  let target = to;
  try {
    const body = await req.json();
    if (typeof body?.to === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.to)) {
      target = body.to.trim();
    }
  } catch {
    /* use default (yard inbox) */
  }

  const result = await sendNotification({
    to: target,
    subject: "Mo's Yard — test email",
    html: notificationHtml({
      heading: 'Test email',
      intro: 'If you can read this, transactional email is working.',
      rows: [
        ['Sent to', target],
        ['Time', new Date().toISOString()],
      ],
    }),
  });

  return NextResponse.json({
    to: target,
    ...result,
  });
}
