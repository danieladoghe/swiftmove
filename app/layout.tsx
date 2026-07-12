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
    "Mo's Yard offers secure outdoor storage spaces, hourly moving crews, and moving supplies in Calgary. Book online in minutes with flexible payment options.",
  keywords: ['outdoor storage', 'storage rental', 'hire movers', 'moving services', 'moving boxes', 'packing supplies', 'container storage', 'Calgary'],
  openGraph: {
    title: "Mo's Yard | Storage, Rentals & Logistics",
    description: 'Storage spaces, moving crews, and supplies — book online in minutes.',
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
