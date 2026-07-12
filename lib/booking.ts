// Shared booking catalog + pricing for Mo's Yard storage, movers, and rentals.
// Rates grounded in 2026 national averages (2-person crew + truck: ~$105–165/hr).

export type ServiceType = 'storage' | 'movers' | 'rental';

export interface StorageSize {
  id: '20' | '30' | '40';
  label: string;
  monthly: number; // dollars
  blurb: string;
  popular?: boolean;
}

export const STORAGE_SIZES: StorageSize[] = [
  { id: '20', label: '20 ft Space', monthly: 95, blurb: '1-bedroom apartment, seasonal gear, or a small vehicle' },
  { id: '30', label: '30 ft Space', monthly: 135, blurb: '2–3 bedroom home, business inventory, or a boat', popular: true },
  { id: '40', label: '40 ft Space', monthly: 185, blurb: 'RV, trailer, or a full household' },
];

export interface StorageTerm {
  months: number;
  label: string;
  discount: number; // fraction off
}

export const STORAGE_TERMS: StorageTerm[] = [
  { months: 1, label: 'Month-to-month', discount: 0 },
  { months: 3, label: '3 months', discount: 0 },
  { months: 6, label: '6 months — prepay & save 5%', discount: 0.05 },
  { months: 12, label: '12 months — prepay & save 10%', discount: 0.1 },
];

export interface MoverCrew {
  id: string;
  label: string;
  hourly: number; // dollars per hour
  blurb: string;
  minHours: number;
  truck: boolean;
  popular?: boolean;
}

export const MOVER_CREWS: MoverCrew[] = [
  { id: 'labor-2', label: '2 Movers — Labor Only', hourly: 89, minHours: 2, truck: false, blurb: 'You have the truck, we bring the muscle. Loading, unloading, or rearranging.' },
  { id: 'crew-2', label: '2 Movers + Truck', hourly: 129, minHours: 2, truck: true, blurb: 'Our most-booked crew. Right for studios up to 2-bedroom homes.', popular: true },
  { id: 'crew-3', label: '3 Movers + Truck', hourly: 169, minHours: 3, truck: true, blurb: 'For 2–3 bedroom homes or anything with stairs involved.' },
  { id: 'crew-4', label: '4 Movers + Truck', hourly: 209, minHours: 4, truck: true, blurb: 'Big homes, offices, and tight timelines.' },
];

export interface RentalItem {
  id: string;
  label: string;
  daily: number; // dollars per day
  blurb: string;
}

export const RENTAL_ITEMS: RentalItem[] = [
  { id: 'forklift', label: 'Forklift (5,000 lb)', daily: 249, blurb: 'Certified operator available on request' },
  { id: 'pallet-jack', label: 'Pallet Jack', daily: 39, blurb: 'Manual, 5,500 lb capacity' },
  { id: 'appliance-dolly', label: 'Appliance Dolly', daily: 29, blurb: 'Strap-equipped, stair-climbing skids' },
  { id: 'furniture-dollies', label: 'Furniture Dollies (set of 4)', daily: 19, blurb: '1,000 lb capacity each' },
  { id: 'blanket-bundle', label: 'Moving Blanket Bundle (12)', daily: 15, blurb: 'Quilted pads, returned washed by us' },
];

export const RENTAL_DELIVERY_FEE = 49; // flat, optional site delivery

export const PAYMENT_OPTIONS = [
  {
    id: 'card-link',
    label: 'Card — secure payment link',
    blurb: "We confirm your booking now and email you a secure card payment link. No charge until you're confirmed.",
  },
  {
    id: 'on-site',
    label: 'Pay at the yard',
    blurb: 'Reserve now, pay by card or cash when you arrive. Held for 48 hours past your start time.',
  },
  {
    id: 'invoice',
    label: 'Business invoice',
    blurb: 'Net-15 invoicing for registered businesses. We follow up to verify your company details.',
  },
] as const;

export const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);

export function storageQuote(sizeId: string, months: number) {
  const size = STORAGE_SIZES.find((s) => s.id === sizeId) ?? STORAGE_SIZES[1];
  const term = STORAGE_TERMS.find((t) => t.months === months) ?? STORAGE_TERMS[0];
  const gross = size.monthly * term.months;
  const total = gross * (1 - term.discount);
  return { size, term, gross, savings: gross - total, total };
}

export function moversQuote(crewId: string, hours: number) {
  const crew = MOVER_CREWS.find((c) => c.id === crewId) ?? MOVER_CREWS[1];
  const billedHours = Math.max(hours, crew.minHours);
  return { crew, billedHours, total: crew.hourly * billedHours };
}

export function rentalQuote(itemIds: string[], days: number, delivery: boolean) {
  const items = RENTAL_ITEMS.filter((i) => itemIds.includes(i.id));
  const perDay = items.reduce((sum, i) => sum + i.daily, 0);
  const total = perDay * Math.max(days, 1) + (delivery ? RENTAL_DELIVERY_FEE : 0);
  return { items, perDay, days: Math.max(days, 1), delivery, total };
}
