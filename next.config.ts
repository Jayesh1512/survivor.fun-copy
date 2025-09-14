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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve?.alias || {}),
        '@coinbase/agentkit/dist/wallet-providers/privyWalletProvider': path.resolve(__dirname, 'stubs/empty.js'),
        '@coinbase/agentkit/dist/wallet-providers/privyEvmWalletProvider': path.resolve(__dirname, 'stubs/empty.js'),
        '@coinbase/agentkit/dist/wallet-providers/privySvmWalletProvider': path.resolve(__dirname, 'stubs/empty.js'),
        '@coinbase/agentkit/dist/wallet-providers/privyEvmDelegatedEmbeddedWalletProvider': path.resolve(__dirname, 'stubs/empty.js'),
        '@coinbase/agentkit/dist/wallet-providers/privyShared': path.resolve(__dirname, 'stubs/empty.js'),
        '@privy-io/server-auth/viem': path.resolve(__dirname, 'stubs/empty.js'),
        '@privy-io/server-auth': path.resolve(__dirname, 'stubs/empty.js'),
        '@hpke/common': path.resolve(__dirname, 'stubs/empty.js'),
        '@hpke/core': path.resolve(__dirname, 'stubs/empty.js'),
        '@hpke/chacha20poly1305': path.resolve(__dirname, 'stubs/empty.js'),
      };
    }
    return config;
  }
};

export default nextConfig;
