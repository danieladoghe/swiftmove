'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search } from 'lucide-react';
import { products, categories, Product } from '@/lib/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { useCart } from '@/components/CartContext';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const filtered = products.filter((p: Product) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="min-h-screen pt-20" style={{ background: 'var(--bg)' }}>
        {/* Shop Hero */}
        <div
          className="py-16 border-b border-[var(--border)] relative overflow-hidden"
          style={{ background: 'var(--surface-2)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'var(--gradient-hero)' }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="
                    inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase
                    bg-[var(--glow-soft)] text-[var(--accent)] border border-[var(--accent)]/20 mb-3
                  "
                >
                  Moving Supplies
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold mb-2"
                >
                  Moving Equipment{' '}
                  <span className="gradient-text">Shop</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-[var(--muted)] text-lg"
                >
                  Professional-grade supplies delivered to your door.
                </motion.p>
              </div>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="btn-primary relative"
              >
                <ShoppingBag size={18} />
                Cart
                {totalItems > 0 && (
                  <span className="
                    absolute -top-2 -right-2 w-5 h-5 rounded-full
                    bg-white text-[var(--accent)] text-xs font-bold
                    flex items-center justify-center
                    border-2 border-[var(--accent)]
                  ">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters + search */}
        <div className="sticky top-16 z-30 border-b border-[var(--border)] shadow-[var(--shadow)]"
          style={{ background: 'var(--navbar-bg)', backdropFilter: 'blur(16px)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setActiveCategory(value)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${activeCategory === value
                        ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--glow-soft)]'
                        : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-input pl-9 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-[var(--muted)]">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">Try a different search or category.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)] mb-6">
                Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Floating cart button (mobile) */}
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setCartOpen(true)}
            className="
              fixed bottom-6 right-6 z-40 md:hidden
              flex items-center gap-2 px-5 py-3.5 rounded-full
              btn-primary shadow-[0_4px_24px_var(--glow)]
            "
          >
            <ShoppingBag size={18} />
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </motion.button>
        )}
      </div>
    </>
  );
}
