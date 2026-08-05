'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Wraps the site chrome (navbar + footer) but drops it on immersive routes —
 * the cinematic landing page (/) and /story bring their own nav and footer.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersive =
    pathname === '/' || pathname?.startsWith('/story') || pathname?.startsWith('/admin');

  if (immersive) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
