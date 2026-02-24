export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: 'boxes' | 'packing' | 'bags' | 'tape' | 'specialty';
  emoji: string;
  badge?: string;
  bestseller?: boolean;
  options?: string[];
}

export const products: Product[] = [
  // Boxes
  {
    id: 'box-small',
    name: 'Small Moving Box',
    description: 'Perfect for books, dishes, and heavy items. Double-wall construction for maximum strength.',
    price: 299,
    category: 'boxes',
    emoji: '📦',
    options: ['Pack of 5', 'Pack of 10', 'Pack of 25'],
    bestseller: true,
  },
  {
    id: 'box-medium',
    name: 'Medium Moving Box',
    description: 'Ideal for kitchen items, toys, and clothing. Our most popular size.',
    price: 349,
    category: 'boxes',
    emoji: '📦',
    options: ['Pack of 5', 'Pack of 10', 'Pack of 25'],
    badge: 'Most Popular',
  },
  {
    id: 'box-large',
    name: 'Large Moving Box',
    description: 'Great for pillows, comforters, and lightweight bulky items.',
    price: 449,
    category: 'boxes',
    emoji: '📦',
    options: ['Pack of 5', 'Pack of 10'],
  },
  {
    id: 'box-xl',
    name: 'Extra-Large Moving Box',
    description: 'For large, lightweight items like lamps, sports gear, and outdoor cushions.',
    price: 549,
    category: 'boxes',
    emoji: '📦',
    options: ['Pack of 5', 'Pack of 10'],
  },
  {
    id: 'box-wardrobe',
    name: 'Wardrobe Box',
    description: 'Built-in hanging bar keeps clothes wrinkle-free. Fits a full closet section.',
    price: 1899,
    category: 'boxes',
    emoji: '👔',
    badge: 'Premium',
  },
  {
    id: 'box-dish-pack',
    name: 'Dish Pack Box',
    description: 'Extra-thick walls with cell dividers for china, glassware, and fragile items.',
    price: 799,
    category: 'boxes',
    emoji: '🍽️',
  },

  // Packing Supplies
  {
    id: 'bubble-wrap-sm',
    name: 'Bubble Wrap Roll — Small',
    description: '12" × 30 ft roll of premium bubble wrap. Ideal for electronics and fragile items.',
    price: 1299,
    category: 'packing',
    emoji: '🫧',
    bestseller: true,
  },
  {
    id: 'bubble-wrap-lg',
    name: 'Bubble Wrap Roll — Large',
    description: '24" × 50 ft heavy-duty roll for furniture and large appliances.',
    price: 2499,
    category: 'packing',
    emoji: '🫧',
  },
  {
    id: 'packing-paper',
    name: 'Packing Paper — 50 Sheets',
    description: "Newsprint-free white packing paper. Won't leave ink marks on your items.",
    price: 999,
    category: 'packing',
    emoji: '📄',
  },
  {
    id: 'foam-wrap',
    name: 'Foam Wrap Sheets — 50 Pk',
    description: 'Self-sealing foam cushioning for dishes, glasses, and collectibles.',
    price: 1499,
    category: 'packing',
    emoji: '🟪',
    badge: 'New',
  },

  // Bags
  {
    id: 'mattress-bag-queen',
    name: 'Mattress Bag — Queen',
    description: 'Heavy-duty polyethylene mattress cover. Protects from dust, dirt, and moisture.',
    price: 1299,
    category: 'bags',
    emoji: '🛏️',
  },
  {
    id: 'mattress-bag-king',
    name: 'Mattress Bag — King',
    description: 'Extra-wide cover for king and California king mattresses.',
    price: 1599,
    category: 'bags',
    emoji: '🛏️',
  },
  {
    id: 'sofa-cover',
    name: 'Sofa Cover Bag',
    description: 'Stretch-wrap style cover for sofas and sectionals. Tear-resistant and waterproof.',
    price: 1999,
    category: 'bags',
    emoji: '🛋️',
    badge: 'Premium',
  },
  {
    id: 'tv-bag',
    name: 'Flat Screen TV Bag',
    description: 'Dual-chamber padded bag with corner protectors for screens up to 85".',
    price: 2499,
    category: 'bags',
    emoji: '📺',
  },

  // Tape
  {
    id: 'packing-tape-3pk',
    name: 'Heavy-Duty Packing Tape — 3 Pack',
    description: '2" × 60 yd rolls of industrial-strength clear tape with dispenser.',
    price: 1099,
    category: 'tape',
    emoji: '🟨',
    bestseller: true,
  },
  {
    id: 'label-markers',
    name: 'Moving Labels Kit',
    description: '100 pre-printed room labels + 2 permanent markers. Color-coded by room.',
    price: 699,
    category: 'tape',
    emoji: '🏷️',
  },

  // Specialty
  {
    id: 'moving-kit-starter',
    name: 'Starter Moving Kit',
    description: '10 mixed boxes, bubble wrap, tape, labels, and packing paper. Perfect for studio apartments.',
    price: 4999,
    category: 'specialty',
    emoji: '🎁',
    badge: 'Bundle',
  },
  {
    id: 'moving-kit-family',
    name: 'Family Moving Kit',
    description: '30 mixed boxes, 2 wardrobe boxes, full packing supplies. Covers a 3-bedroom home.',
    price: 12999,
    category: 'specialty',
    emoji: '🏠',
    badge: 'Best Value',
  },
];

export const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'boxes', label: 'Moving Boxes' },
  { value: 'packing', label: 'Packing Supplies' },
  { value: 'bags', label: 'Covers & Bags' },
  { value: 'tape', label: 'Tape & Labels' },
  { value: 'specialty', label: 'Bundle Kits' },
];
