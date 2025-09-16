import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

export const useBlockchain = () => {
  const { address } = useAccount();

  const { data: activeAgentId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserActiveAgentId',
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined };

  const killAgent = async () => {
    if (!activeAgentId) {
      console.error('No active agent id');
      return;
    }
    const privateKey = process.env.SPONSOR_WALLET_PRIVATE_KEY as `0x${string}` | undefined;
    if (!privateKey) {
      console.error('Missing SPONSOR_WALLET_PRIVATE_KEY');
      return;
    }
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    });
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'killAgent',
        args: [activeAgentId],
      });
      console.log('Transaction sent with hash:', hash);
      return hash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  };

  return {
    activeAgentId,
    killAgent,
  };
};
