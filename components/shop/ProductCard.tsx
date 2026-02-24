'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/components/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState(product.options?.[0]);
  const [added, setAdded] = useState(false);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const handleAdd = () => {
    addItem(product, 1, selectedOption);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="product-card flex flex-col"
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center h-44 text-6xl"
        style={{ background: 'var(--surface-2)' }}
      >
        <span>{product.emoji}</span>
        {product.badge && (
          <span className="
            absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold
            bg-[var(--accent)] text-white
          ">
            {product.badge}
          </span>
        )}
        {product.bestseller && (
          <span className="
            absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold
            bg-[var(--text)] text-[var(--bg)]
          ">
            Bestseller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-semibold text-[var(--text)] text-base leading-snug mb-1.5">
            {product.name}
          </h3>
          <p className="text-[var(--muted)] text-xs leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Options */}
        {product.options && product.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.options.map(opt => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                className={`
                  px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all duration-150
                  ${selectedOption === opt
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--glow-soft)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50'
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-bold text-[var(--text)]">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${added
                ? 'bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.4)]'
                : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] hover:shadow-[0_0_14px_var(--glow)]'
              }
            `}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
