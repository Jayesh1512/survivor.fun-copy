import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';

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
    try {
      const res = await fetch('/api/kill-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: activeAgentId.toString() }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Failed to send transaction:', data?.error || res.statusText);
        return;
      }
      console.log('Transaction sent with hash:', data.hash);
      return data.hash as `0x${string}`;
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  };

  return {
    activeAgentId,
    killAgent,
  };
};
