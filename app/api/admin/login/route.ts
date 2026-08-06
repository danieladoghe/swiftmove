import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_MAX_AGE, createSession } from '@/lib/admin-auth';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  const password = env('ADMIN_PASSWORD');
  const secret = env('AUTH_SECRET');
  const expectedUser = env('ADMIN_USERNAME') || 'admin';

  if (!password || !secret) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_PASSWORD and AUTH_SECRET.' },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if ((body.username || 'admin') !== expectedUser || body.password !== password) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  const token = await createSession(expectedUser);
  if (!token) {
    return NextResponse.json({ error: 'Could not create session.' }, { status: 500 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
