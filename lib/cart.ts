import { Product } from './products';

/** Format a price in cents as Canadian dollars (site-wide currency). */
export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, option?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};
