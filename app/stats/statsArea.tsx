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
    router.push('/tournament');
  };

  return (
    <div className="w-full h-[400px] md:h-[347px] relative bg-gray-900">
      <div className="relative h-full w-full">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/stats/stats.svg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover pointer-events-none"
          />
        </div>

        {/* Stats Text */}
        <div className="relative z-10 text-center text-white text-lg h-[60%] flex flex-col justify-between items-center overflow-visible pt-6 px-4">
          {/* Total Agents at top */}
          <div className="flex flex-col items-center">
            <span className="opacity-80 text-sm">Total Agents</span>
            <p className="text-2xl font-bold">{totalAgents}</p>
          </div>

          {/* Kills & Survivals above the button */}
          <div className="w-full flex justify-between px-8 md:px-16 mb-4">
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
      <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <Button
          className="relative overflow-hidden w-[300px] md:w-[358px] h-[60px] md:h-[74px] text-[20px] md:text-[24px] font-bold flex items-center justify-center"
          onClick={handlePlayAgain}
        >
          <Image src={buttonBg} alt="" aria-hidden fill sizes="(max-width: 768px) 300px, 358px" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Play</span>
        </Button>
      </div>
    </div>
  );
}
