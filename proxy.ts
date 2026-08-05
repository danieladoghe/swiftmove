import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-auth';

// Guard the admin area (Next 16 "proxy" convention, formerly middleware). The
// login page and the login/logout endpoints stay public; everything else under
// /admin and /api/admin requires a valid session.
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

const PUBLIC_PATHS = new Set(['/admin/login', '/api/admin/login', '/api/admin/logout']);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const user = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
  if (user) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}
