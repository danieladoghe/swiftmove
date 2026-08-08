import { NextRequest, NextResponse } from 'next/server';
import { STATUSES, updateStatus, type SubmissionStatus } from '@/lib/db';
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Auth-checked here directly (defense in depth on top of proxy.ts).
  const user = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const status = body.status as SubmissionStatus;
  if (!status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const result = await updateStatus(id, status);
  if (!result.ok) {
    const code = result.error === 'no_database' ? 503 : 404;
    return NextResponse.json(
      { error: result.error === 'no_database' ? 'Database not configured.' : 'Submission not found.' },
      { status: code }
    );
  }
  return NextResponse.json({ success: true });
}
