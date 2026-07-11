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
  title: "Mo's Yard | Storage, Rentals & Logistics",
  description:
    "Mo's Yard offers secure outdoor storage, equipment rentals, and reliable logistics and moving services. Flexible month-to-month terms. Get a free quote today.",
  keywords: ['outdoor storage', 'storage rental', 'equipment rentals', 'logistics', 'moving services', 'moving boxes', 'packing supplies', 'container storage'],
  openGraph: {
    title: "Mo's Yard | Storage, Rentals & Logistics",
    description: 'Secure outdoor storage, rentals, and logistics. Fully insured, 12+ years experience, 6,000+ customers served.',
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
