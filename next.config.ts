import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Allow images from external domains (add your image domains here)
  images: {
    remotePatterns: [],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            // Square Web Payments SDK needs more than just the squarecdn script
            // host: a dedicated font server, a CloudFront asset host, the
            // connect.squareup.com 3-D Secure frame, a blob web worker, and its
            // Sentry endpoint. Sandbox happens to tolerate the gaps; production
            // is stricter, so we list the full union of both environments.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://js.squareup.com https://js.squareupsandbox.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "font-src 'self' data: https://fonts.gstatic.com https://square-fonts-production-f.squarecdn.com https://d1g145x70srn7h.cloudfront.net https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "img-src 'self' data: blob: https://d1g145x70srn7h.cloudfront.net https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "connect-src 'self' https://connect.squareupsandbox.com https://connect.squareup.com https://pci-connect.squareupsandbox.com https://pci-connect.squareup.com https://sandbox.web.squarecdn.com https://web.squarecdn.com https://d1g145x70srn7h.cloudfront.net https://o160250.ingest.sentry.io",
              "frame-src 'self' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://connect.squareupsandbox.com https://connect.squareup.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
