// Mo's Yard — real company details used across the site.

export const COMPANY = {
  legalName: "Mo's Yard",
  tagline: 'Storage • Rentals • Logistics',
  address: {
    line1: '247 Don Seaman Way',
    line2: 'Okotoks, AB T1S 0C2',
    full: '247 Don Seaman Way, Okotoks, AB T1S 0C2',
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mo's+Yard+247+Don+Seaman+Way+Okotoks+AB",
  },
  phone: { display: '403-903-4107', tel: '+14039034107' },
  email: 'info@mosyard.ca',
  domain: 'https://www.mosyard.ca',
  /** Google Business Profile (maps search link until the short URL is supplied). */
  googleUrl: "https://www.google.com/maps/search/?api=1&query=Mo's+Yard+Okotoks+AB",
  /** Social profiles not created yet — keep as TBD placeholders. */
  socials: [
    { label: 'Google', href: "https://www.google.com/maps/search/?api=1&query=Mo's+Yard+Okotoks+AB" },
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'X', href: '#' },
  ],
} as const;

export const HOURS: { day: string; hours: string }[] = [
  { day: 'Monday', hours: '12:00 pm – 4:00 pm' },
  { day: 'Tuesday', hours: '12:00 pm – 4:00 pm' },
  { day: 'Wednesday', hours: '10:00 am – 6:00 pm' },
  { day: 'Thursday', hours: '10:00 am – 6:00 pm' },
  { day: 'Friday', hours: '10:00 am – 6:00 pm' },
  { day: 'Saturday', hours: '12:00 pm – 4:00 pm' },
  { day: 'Sunday', hours: 'Closed' },
];

export const SERVICE_AREA = {
  primary: ['Okotoks', 'High River', 'Foothills County', 'South Calgary'],
  extended: 'Available throughout Southern Alberta upon request.',
} as const;

export const UHAUL_URL = 'https://www.uhaul.com/';

export const RETURN_POLICY =
  'Returns accepted within 30 days for unused, unopened items with proof of purchase. Opened, damaged, or special-order items are non-refundable unless defective.';

export const DELIVERY_NOTE =
  'Local delivery across Okotoks, High River, Foothills County, and South Calgary — delivery fee confirmed when we process your order.';
