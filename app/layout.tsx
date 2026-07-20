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
  title: "Mo's Yard | Outdoor Storage, U-Haul Rentals & Logistics in Okotoks",
  description:
    "Secure outdoor storage yards, U-Haul rentals, moving supplies, and freight & logistics support at 247 Don Seaman Way, Okotoks — serving High River, Foothills County, and South Calgary. Reserve your space online.",
  keywords: ['outdoor storage Okotoks', 'contractor yard storage', 'U-Haul Okotoks', 'freight logistics Foothills', 'moving supplies Okotoks', 'storage High River', 'yard storage Alberta'],
  openGraph: {
    title: "Mo's Yard | Storage, Rentals & Logistics — Okotoks, AB",
    description: 'Secure outdoor storage yards from $299/mo launch pricing, U-Haul rentals, moving supplies, and freight support.',
    type: 'website',
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
