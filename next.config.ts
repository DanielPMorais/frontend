import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: '72.60.155.229',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // Proxy para API em desenvolvimento (evita problemas de CORS)
    let apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://72.60.155.229:3333';
    // Remove barra final se existir
    apiBaseUrl = apiBaseUrl.trim().replace(/\/+$/, '');

    return [
      {
        source: '/api/proxy/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
