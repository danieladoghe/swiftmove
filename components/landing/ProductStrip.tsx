'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import { formatPrice as fmt } from '@/lib/cart';
import { useCart } from '@/components/CartContext';

// Bestsellers + the family kit — one card per pillar of a typical move.
const featured = products.filter(
  (p) => p.bestseller || p.id === 'moving-kit-family'
).slice(0, 5);

export function ProductStrip() {
  const { addItem, totalItems } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    addItem(product, 1, product.options?.[0]);
    setAdded(id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <section id="supplies" className="relative scroll-mt-20 overflow-hidden bg-[var(--surface-2)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      {/* Background details */}
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -left-40 top-16 h-[380px] w-[380px] rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
              The Shop
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Everything You Need to Pack &amp; Move
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--muted)]">
              Boxes, blankets, tape, and gear — reserve online, then pick up at
              the yard or get local delivery. All prices in CAD.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 whitespace-nowrap font-semibold text-[var(--accent-dark)] transition-colors hover:text-[var(--accent)]"
          >
            Browse all supplies{totalItems > 0 ? ` · cart (${totalItems})` : ''}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <Link href="/shop" className="relative block h-36 bg-[var(--surface-2)] p-3 sm:h-40">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local SVG illustration
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-5xl">{product.emoji}</span>
                )}
                {product.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#F5921E] px-2 py-0.5 text-[10px] font-bold text-white">
                    {product.badge}
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-sm font-bold leading-snug">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-bold">{fmt(product.price)}</span>
                  <button
                    onClick={() => handleAdd(product.id)}
                    aria-label={`Add ${product.name} to cart`}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200 ${
                      added === product.id ? 'bg-[var(--accent-dark)]' : 'bg-[#F5921E] hover:bg-[#FFA733]'
                    }`}
                  >
                    {added === product.id ? <Check size={15} /> : <ShoppingCart size={15} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-center text-sm text-[var(--muted)]"
        >
          Added something? Head to the{' '}
          <Link href="/shop" className="font-semibold text-[var(--accent-dark)] underline-offset-2 hover:underline">
            shop
          </Link>{' '}
          to review your cart and reserve for pickup.
        </motion.p>
      </div>
    </section>
  );
}
