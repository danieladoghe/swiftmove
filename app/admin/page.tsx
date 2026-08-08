import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardData, pingDatabase, STATUSES, type SubmissionRow } from '@/lib/db';
import { StatusSelect, LogoutButton } from '@/components/admin/AdminControls';
import { Diagnostics } from '@/components/admin/Diagnostics';
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-auth';
import { emailStatus } from '@/lib/email';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const TYPE_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'booking', label: 'Reservations' },
  { key: 'order', label: 'Orders' },
  { key: 'quote', label: 'Freight quotes' },
  { key: 'enquiry', label: 'Enquiries' },
];

const TYPE_LABEL: Record<string, string> = {
  booking: 'Reservation',
  order: 'Order',
  quote: 'Freight',
  enquiry: 'Enquiry',
};

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  scheduled: 'Scheduled',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const c = {
  bg: '#0e1013',
  surface: '#181b20',
  border: '#2a2e35',
  text: '#f2f0ec',
  muted: '#9aa0a8',
  accent: '#f5921e',
};

function fmtMoney(cents: number | null): string {
  if (cents == null) return '—';
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  // Server-side auth guard — protects the dashboard even if the edge middleware
  // isn't running (defense in depth on top of proxy.ts).
  const jar = await cookies();
  const admin = await verifySession(jar.get(ADMIN_COOKIE)?.value);
  if (!admin) redirect('/admin/login?next=/admin');

  const sp = await searchParams;
  const type = sp.type || 'all';
  const status = sp.status || 'all';

  const emailCfg = emailStatus();
  const dbPing = await pingDatabase();
  const squareCfg = {
    configured:
      !!env('SQUARE_ACCESS_TOKEN') &&
      !!process.env.NEXT_PUBLIC_SQUARE_APP_ID &&
      !!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    env: env('SQUARE_ENV') || 'sandbox',
  };

  const data = await getDashboardData({ type, status });
  const rows = data.state === 'ok' ? data.rows : [];
  const counts = data.state === 'ok' ? data.counts : null;

  const configured = data.state === 'ok';

  const buildHref = (next: { type?: string; status?: string }) => {
    const t = next.type ?? type;
    const s = next.status ?? status;
    const q = new URLSearchParams();
    if (t && t !== 'all') q.set('type', t);
    if (s && s !== 'all') q.set('status', s);
    const qs = q.toString();
    return `/admin${qs ? `?${qs}` : ''}`;
  };

  const totalPending = counts ? (counts.new || 0) + (counts.in_progress || 0) + (counts.scheduled || 0) : 0;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Mo&apos;s Yard — Admin</h1>
            <p style={{ margin: '4px 0 0', color: c.muted, fontSize: 14 }}>
              Customer requests, orders &amp; enquiries.
              {configured && (
                <span style={{ color: c.accent }}> {totalPending} open</span>
              )}
            </p>
          </div>
          <LogoutButton />
        </div>

        <Diagnostics email={emailCfg} database={dbPing} square={squareCfg} />

        {data.state === 'not_configured' ? (
          <SetupNotice />
        ) : data.state === 'error' ? (
          <ErrorNotice message={data.message} />
        ) : (
          <>
            {/* Status summary */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0 4px' }}>
              {STATUSES.map((s) => (
                <Link
                  key={s}
                  href={buildHref({ status: status === s ? 'all' : s })}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: `1px solid ${status === s ? c.accent : c.border}`,
                    background: status === s ? 'rgba(245,146,30,0.12)' : c.surface,
                    color: c.text,
                    fontSize: 13,
                    minWidth: 92,
                  }}
                >
                  <div style={{ color: c.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {STATUS_LABEL[s]}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{counts?.[s] ?? 0}</div>
                </Link>
              ))}
            </div>

            {/* Type tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0' }}>
              {TYPE_TABS.map((t) => (
                <Link
                  key={t.key}
                  href={buildHref({ type: t.key })}
                  style={{
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: `1px solid ${type === t.key ? c.accent : c.border}`,
                    background: type === t.key ? c.accent : 'transparent',
                    color: type === t.key ? '#fff' : c.muted,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>

            {/* Table */}
            {rows.length === 0 ? (
              <p style={{ color: c.muted, marginTop: 40 }}>No submissions match this filter yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: `1px solid ${c.border}`, borderRadius: 14 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, minWidth: 760 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: c.muted, background: c.surface }}>
                      <th style={th}>When</th>
                      <th style={th}>Type</th>
                      <th style={th}>Ref</th>
                      <th style={th}>Customer</th>
                      <th style={th}>Summary</th>
                      <th style={th}>Amount</th>
                      <th style={th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <Row key={row.id} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '11px 14px', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid #2a2e35' };
const td: React.CSSProperties = { padding: '11px 14px', borderBottom: '1px solid #2a2e35', verticalAlign: 'top' };

function Row({ row }: { row: SubmissionRow }) {
  const contact = [row.email, row.phone].filter(Boolean).join(' · ');
  return (
    <tr>
      <td style={{ ...td, color: c.muted, whiteSpace: 'nowrap' }}>{fmtDate(row.created_at)}</td>
      <td style={td}>{TYPE_LABEL[row.type] ?? row.type}</td>
      <td style={{ ...td, fontFamily: 'ui-monospace, monospace', color: c.accent }}>{row.reference}</td>
      <td style={td}>
        <div style={{ fontWeight: 600 }}>{row.name || '—'}</div>
        {row.company && <div style={{ color: c.muted, fontSize: 12 }}>{row.company}</div>}
        {contact && <div style={{ color: c.muted, fontSize: 12 }}>{contact}</div>}
      </td>
      <td style={{ ...td, maxWidth: 280 }}>
        <div>{row.summary || '—'}</div>
        <details style={{ marginTop: 4 }}>
          <summary style={{ cursor: 'pointer', color: c.muted, fontSize: 12 }}>details</summary>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '6px 0 0', color: c.muted, fontSize: 12 }}>
            {JSON.stringify(row.details, null, 2)}
          </pre>
        </details>
      </td>
      <td style={{ ...td, whiteSpace: 'nowrap' }}>{row.fulfillment ? `${fmtMoney(row.amount_cents)} · ${row.fulfillment}` : fmtMoney(row.amount_cents)}</td>
      <td style={td}>
        <StatusSelect id={row.id} status={row.status} statuses={STATUSES} />
      </td>
    </tr>
  );
}

function SetupNotice() {
  return (
    <div style={{ marginTop: 26, border: `1px solid ${c.border}`, borderRadius: 14, background: c.surface, padding: 22, lineHeight: 1.6 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 17 }}>Database not configured</h2>
      <p style={{ margin: '0 0 12px', color: c.muted, fontSize: 14 }}>
        The dashboard is live, but it needs a Postgres database to store and show submissions. Set
        <code style={code}> DATABASE_URL</code> in your Netlify environment (Neon and Supabase both have free tiers), then redeploy.
      </p>
      <p style={{ margin: 0, color: c.muted, fontSize: 14 }}>
        Also required for this page: <code style={code}>ADMIN_PASSWORD</code> and <code style={code}>AUTH_SECRET</code> (you already have them, since you signed in). Email needs <code style={code}>RESEND_API_KEY</code>.
      </p>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div style={{ marginTop: 26, border: '1px solid #7a2e2e', borderRadius: 14, background: '#221618', padding: 22, lineHeight: 1.6 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 17, color: '#ff8f8f' }}>Couldn&apos;t connect to the database</h2>
      <p style={{ margin: '0 0 12px', color: c.muted, fontSize: 14 }}>
        <code style={code}>DATABASE_URL</code> is set, but the connection failed. This is almost always the
        connection string itself. Check, in Supabase → <b>Connect</b>:
      </p>
      <ul style={{ margin: '0 0 12px', paddingLeft: 18, color: c.muted, fontSize: 14 }}>
        <li>Use the <b>Transaction pooler</b> string (host ends in <code style={code}>pooler.supabase.com</code>, port <code style={code}>6543</code>).</li>
        <li>Replace <code style={code}>[YOUR-PASSWORD]</code> with your real database password (Settings → Database → reset it if unsure).</li>
        <li>No spaces or line breaks in the value; keep <code style={code}>:6543/postgres</code> at the end.</li>
      </ul>
      <p style={{ margin: 0, color: '#9aa0a8', fontSize: 12.5 }}>
        Server said: <code style={{ ...code, color: '#ffb4b4' }}>{message}</code>
      </p>
    </div>
  );
}

const code: React.CSSProperties = { background: '#0e1013', border: '1px solid #2a2e35', borderRadius: 5, padding: '1px 6px', fontSize: 13 };
