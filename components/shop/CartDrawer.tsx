'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="
              fixed right-0 top-0 bottom-0 z-50 w-full max-w-md
              flex flex-col shadow-2xl
            "
            style={{ background: 'var(--surface)' }}
          >
            {/* Header */}
            <div className="
              flex items-center justify-between px-6 py-5
              border-b border-[var(--border)]
            ">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-[var(--accent)]" />
                <span className="font-bold text-lg">Your Cart</span>
                {totalItems > 0 && (
                  <span className="
                    w-5 h-5 rounded-full bg-[var(--accent)] text-white
                    text-xs font-bold flex items-center justify-center
                  ">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="
                  w-9 h-9 rounded-lg flex items-center justify-center
                  text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]
                  transition-colors
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-[var(--border)]" />
                  <div>
                    <p className="font-semibold text-[var(--text)] mb-1">Your cart is empty</p>
                    <p className="text-[var(--muted)] text-sm">Add some products to get started!</p>
                  </div>
                  <button onClick={onClose} className="btn-ghost text-sm py-2 px-5">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity, selectedOption }) => (
                  <div
                    key={`${product.id}-${selectedOption}`}
                    className="
                      flex gap-4 p-4 rounded-xl border border-[var(--border)]
                      bg-[var(--surface-2)]
                    "
                  >
                    {/* Emoji icon */}
                    <div className="
                      w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0
                    " style={{ background: 'var(--surface)' }}>
                      {product.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--text)] truncate">{product.name}</p>
                      {selectedOption && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">{selectedOption}</p>
                      )}
                      <p className="font-bold text-[var(--accent)] text-sm mt-1">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / 100)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="
                            w-7 h-7 rounded-md border border-[var(--border)] flex items-center justify-center
                            text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]
                            transition-colors
                          "
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="
                            w-7 h-7 rounded-md border border-[var(--border)] flex items-center justify-center
                            text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]
                            transition-colors
                          "
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="ml-auto text-[var(--muted)] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="
                px-6 py-5 border-t border-[var(--border)]
                space-y-4
              ">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted)] text-sm">Subtotal</span>
                  <span className="font-bold text-xl text-[var(--text)]">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal / 100)}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/shop/checkout"
                  onClick={onClose}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="btn-ghost w-full justify-center text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
