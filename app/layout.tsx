import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SwiftMove Co. | Premium Moving Services & Supplies',
  description:
    'SwiftMove Co. offers professional local and long-distance moving services, packing, storage solutions, and quality moving supplies. Get a free quote today.',
  keywords: ['moving company', 'moving services', 'local movers', 'long distance moving', 'moving boxes', 'packing supplies', 'storage'],
  openGraph: {
    title: 'SwiftMove Co. | Premium Moving Services & Supplies',
    description: 'Professional moving services and supplies. Fully insured, 12+ years experience, 6,000+ moves completed.',
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
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
