import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export const useWalletCookie = () => {
    const { isConnected, address } = useAccount();

    useEffect(() => {
        console.log('[useWalletCookie] Wallet state changed:', { isConnected, address });

        if (isConnected && address) {
            console.log('[useWalletCookie] Setting wallet cookie for address:', address);
            document.cookie = `wallet_address=${address}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        } else {
            console.log('[useWalletCookie] Clearing wallet cookie');
            // Clear cookie when disconnected
            document.cookie = 'wallet_address=; path=/; max-age=0';
        }
    }, [isConnected, address]);
};
