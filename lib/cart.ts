import { Product } from './products';

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
