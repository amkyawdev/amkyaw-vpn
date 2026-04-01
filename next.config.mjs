/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://amkyaw-vpn-api.vercel.app/api/v1',
  },
  async rewrites() {
    return [
      {
        source: '/data/ovpn/:path*',
        destination: '/data/ovpn/:path*',
      },
    ];
  },
};

export default nextConfig;
