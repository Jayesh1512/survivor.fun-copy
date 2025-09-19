"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import buttonBg from '@/public/assets/button.webp';
import { useRouter } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';

export default function StatsArea() {
  const router = useRouter();

  const { data: tournamentStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTournamentStats',
  }) as { data: readonly [bigint, bigint, bigint, bigint] | undefined };

  const [totalMints, totalGraves, totalSurvived, totalGames] = (() => {
    if (!tournamentStats) return ["-", "-", "-", "-"] as const;
    const [mints, graves, survived, games] = tournamentStats;
    return [mints.toString(), graves.toString(), survived.toString(), games.toString()] as const;
  })();

  const handlePlayAgain = () => {
    router.push('/mint');
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] h-[347px]">
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/stats/stats.svg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="text-center text-white text-lg pt-6 space-y-1">
          <div className="flex flex-col items-center">
            <span className="opacity-80 text-sm">Total Games</span>
            <p className="text-2xl font-bold">{totalGames}</p>
          </div>
          <div className="flex justify-center gap-6 mt-1 text-sm">
            <div className="flex flex-col items-center">
              <span className="opacity-80">Mints</span>
              <span className="text-white font-semibold">{totalMints}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-80">Graves</span>
              <span className="text-white font-semibold">{totalGraves}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-80">Survivals</span>
              <span className="text-white font-semibold">{totalSurvived}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Try Again Button */}
      <div className="absolute bottom-10 right-6">
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
