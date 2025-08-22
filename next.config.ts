import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true
  },
  serverExternalPackages: [
    "twitter-api-v2",
    "@noble/ciphers",
    "@noble/hashes",
    "@noble/curves",
    "@stablelib/chacha20poly1305",
    "jose"
  ]
};

export default nextConfig;
