import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true
  },
  serverExternalPackages: [
    "twitter-api-v2",
    "@hpke/core",
    "@privy-io/server-auth",
    "@coinbase/agentkit",
    "@coinbase/agentkit-vercel-ai-sdk"
  ]
};

export default nextConfig;
