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
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "font-src 'self' https://fonts.gstatic.com https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "img-src 'self' data: blob: https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "connect-src 'self' https://connect.squareupsandbox.com https://connect.squareup.com https://pci-connect.squareupsandbox.com https://pci-connect.squareup.com https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "frame-src https://sandbox.web.squarecdn.com https://web.squarecdn.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
