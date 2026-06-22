import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://scholarship-platform-backend-tq3p.onrender.com'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/auth/:path*', destination: `${BACKEND_URL}/auth/:path*` },
      { source: '/profile/:path*', destination: `${BACKEND_URL}/profile/:path*` },
      { source: '/ai/:path*', destination: `${BACKEND_URL}/ai/:path*` },
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
    ]
  },
};

export default nextConfig;
