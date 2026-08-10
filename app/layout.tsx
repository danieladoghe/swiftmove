import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartContext';
import { SiteShell } from '@/components/SiteShell';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mosyard.ca'),
  title: "Mo's Yard | Contractor Outdoor Storage, U-Haul Rentals & Moving Supplies in Okotoks",
  description:
    "Secure, fenced outdoor storage for contractors and businesses — plus U-Haul truck & trailer rentals, moving supplies, and freight support at 247 Don Seaman Way, Okotoks. Serving High River, Foothills County, and South Calgary. Reserve your yard online.",
  keywords: ['outdoor storage Okotoks', 'contractor yard storage', 'U-Haul Okotoks', 'freight logistics Foothills', 'moving supplies Okotoks', 'storage High River', 'yard storage Alberta'],
  alternates: { canonical: '/' },
  openGraph: {
    title: "Mo's Yard | Contractor Outdoor Storage, U-Haul Rentals & Moving Supplies",
    description: 'Secure, fenced outdoor storage for contractors — plus U-Haul rentals, moving supplies, and freight support in Okotoks, Alberta.',
    url: 'https://www.mosyard.ca',
    siteName: "Mo's Yard",
    locale: 'en_CA',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: "Mo's Yard — Contractor Outdoor Storage in Okotoks" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mo's Yard | Contractor Outdoor Storage in Okotoks",
    description: 'Secure outdoor storage for contractors, U-Haul rentals, moving supplies & freight — Okotoks, AB.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
