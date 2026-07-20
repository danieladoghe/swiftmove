// Mo's Yard outdoor storage catalog + reservation pricing. All prices CAD.
// Regular prices come from the paired launch/regular price sheet; the
// reservation invoice covers the first month at the launch rate.

export interface YardSpace {
  id: string;
  name: string;
  dims: string; // e.g. 30' × 10'
  sqft: number;
  launch: number | null; // launch price $/mo (null = quote only)
  regular: number | null; // regular price $/mo
  blurb: string;
  custom?: boolean;
}

export const YARD_SPACES: YardSpace[] = [
  {
    id: 'flex',
    name: 'Flex Yard',
    dims: "30' × 10'",
    sqft: 300,
    launch: 299,
    regular: 349,
    blurb: 'A tidy footprint for a trailer, small equipment, or seasonal overflow.',
  },
  {
    id: 'contractor',
    name: 'Contractor Yard',
    dims: "30' × 20'",
    sqft: 600,
    launch: 549,
    regular: 649,
    blurb: 'Room for a work truck, trailer, and materials — the working contractor’s pick.',
  },
  {
    id: 'business',
    name: 'Business Yard',
    dims: "30' × 30'",
    sqft: 900,
    launch: 799,
    regular: 899,
    blurb: 'Space to stage inventory, vehicles, and equipment side by side.',
  },
  {
    id: 'fleet',
    name: 'Fleet Yard',
    dims: "30' × 40'",
    sqft: 1200,
    launch: 999,
    regular: 1099,
    blurb: 'Park multiple vehicles or a small fleet with room to maneuver.',
  },
  {
    id: 'premium',
    name: 'Premium Compound',
    dims: "30' × 50'",
    sqft: 1500,
    launch: 1199,
    regular: 1349,
    blurb: 'Our largest standard compound for serious storage and operations.',
  },
  {
    id: 'custom',
    name: 'Custom Contractor Yard',
    dims: '1,500+ sq. ft.',
    sqft: 1500,
    launch: null,
    regular: null,
    blurb: 'Need more ground or a tailored setup? We’ll configure a compound around you.',
    custom: true,
  },
];

/** Every yard includes: */
export const YARD_FEATURES = [
  '24/7 gated access',
  'Security cameras',
  'LED site lighting',
  'Snow removal',
  'Washroom access during business hours',
  'Package & freight receiving',
  'Online payments & account management',
  'Loading/unloading assistance (subject to equipment availability)',
  'U-Haul rental discounts & customer priority',
  'Site maintenance & dedicated support',
];

/** Compact feature set for pricing cards. */
export const YARD_CARD_FEATURES = [
  '24/7 gated access',
  'Cameras & LED lighting',
  'Snow removal included',
];

export const ACCEPTED_PAYMENTS = [
  'Credit card',
  'Debit card',
  'E-Transfer',
  'EFT / bank transfer (commercial)',
  'Invoice (approved commercial accounts)',
  'Pay at yard / pickup (where applicable)',
];

export const GST_RATE = 0.05; // Alberta: 5% GST, no PST

export const fmtCAD = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);

export function yardQuote(spaceId: string) {
  const space = YARD_SPACES.find((s) => s.id === spaceId && !s.custom) ?? YARD_SPACES[1];
  const monthly = space.launch ?? space.regular ?? 0;
  const gst = monthly * GST_RATE;
  return {
    space,
    monthly,
    regular: space.regular ?? monthly,
    savings: (space.regular ?? monthly) - monthly,
    gst,
    firstInvoiceTotal: monthly + gst,
  };
}
