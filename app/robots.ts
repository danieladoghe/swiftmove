import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mosyard.ca';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep the admin area, API, and transient checkout pages out of search.
      disallow: ['/admin', '/api/', '/shop/checkout', '/shop/order-success'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
