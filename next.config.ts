import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const backendOrigin = new URL(apiUrl.replace(/\/api\/?$/, ''));
const isLocalBackend = ['localhost', '127.0.0.1', '::1'].includes(backendOrigin.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendOrigin.protocol.replace(':', '') as 'http' | 'https',
        hostname: backendOrigin.hostname,
        port: backendOrigin.port || undefined,
        pathname: '/uploads/**',
      },
    ],
    // Next's SSRF guard blocks proxying images from hosts that resolve to a private/loopback
    // IP. In dev the backend genuinely is localhost, so allow it there only — a real deployed
    // backend will have a public hostname and won't need (or get) this bypass.
    ...(isLocalBackend ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
