import { NextRequest, NextResponse } from 'next/server';
import { STATUSES, updateStatus, type SubmissionStatus } from '@/lib/db';

// Guarded by middleware (valid admin session required).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
