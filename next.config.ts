import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true
  },
  serverExternalPackages: [
    "twitter-api-v2"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      '@coinbase/agentkit/dist/wallet-providers/privyWalletProvider': './stubs/empty.js',
      '@coinbase/agentkit/dist/wallet-providers/privyEvmWalletProvider': './stubs/empty.js',
      '@coinbase/agentkit/dist/wallet-providers/privySvmWalletProvider': './stubs/empty.js',
      '@coinbase/agentkit/dist/wallet-providers/privyEvmDelegatedEmbeddedWalletProvider': './stubs/empty.js',
      '@coinbase/agentkit/dist/wallet-providers/privyShared': './stubs/empty.js',
      '@privy-io/server-auth/viem': './stubs/empty.js',
      '@privy-io/server-auth': './stubs/empty.js',
      '@hpke/common': './stubs/empty.js',
      '@hpke/core': './stubs/empty.js',
      '@hpke/chacha20poly1305': './stubs/empty.js',
    }
  }
};

export default nextConfig;
