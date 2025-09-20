"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import buttonBg from '@/public/assets/button.webp';
import { useRouter } from 'next/navigation';
import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';

export default function StatsArea() {
  const router = useRouter();
  const { address } = useAccount();

  const { data: userStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
  }) as { data: readonly [bigint, bigint, bigint, readonly bigint[]] | undefined };

  const [totalMints, totalKills, totalSurvivals, totalAgents] = (() => {
    if (!userStats) return ["-", "-", "-", "-"] as const;
    const [mints, kills, survivals, agentIds] = userStats;
    return [
      mints.toString(),
      kills.toString(),
      survivals.toString(),
      agentIds.length.toString(),
    ] as const;
  })();

  const handlePlayAgain = () => {
    router.push('/mint');
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-[347px] isolate">
      <div className="relative isolate h-full w-full">
        {/* Background */}
        <img 
          src="/assets/stats/stats.svg" 
          alt="" 
          aria-hidden 
          className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" 
        />

        {/* Stats Text */}
        <div className="relative z-10 text-center text-white text-lg h-[60%] flex flex-col justify-between items-center overflow-visible pt-6">
          {/* Total Agents at top */}
          <div className="flex flex-col items-center">
            <span className="opacity-80 text-sm">Total Agents</span>
            <p className="text-2xl font-bold">{totalAgents}</p>
          </div>

          {/* Kills & Survivals above the button */}
          {/* Kills & Survivals above the button */}
          <div className="w-full flex justify-between px-16 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-white font-semibold">{totalKills}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-semibold">{totalSurvivals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Play Again Button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Button
          className="relative overflow-hidden w-[358px] h-[74px] text-[24px] font-bold flex items-center justify-center"
          onClick={handlePlayAgain}
        >
          <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Play Again</span>
        </Button>
      </div>
    </div>
  );
}
