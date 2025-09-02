'use client';
import type { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { baseSepolia, type AppKitNetwork } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();
const projectId = '48d0600b40c62dbdd017ffb85ad8bf90';

const metadata = {
  name: 'Survivor.fun',
  description: 'survivor.fun',
  url: 'https://survivor.fun', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia];
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
});


export function Providers(props: { children: ReactNode }) {

  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY_NAME}
      chain={baseSepolia}
    >
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </MiniKitProvider>
  );
}
