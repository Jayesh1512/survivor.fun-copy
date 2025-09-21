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
      <div className='p-4'>
        <Image
          src='/assets/stats/box.png'
          alt="Stats Box"
          width={375}
          height={347}
          className='w-full object-cover'
        />
        <div className='text-white mx-auto text-center absolute left-1/2 -translate-x-1/2 top-1/10'>
          <p className=''>Total Games Played</p>
          <p className='text-4xl'>{totalAgents}</p>
        </div>
      </div>

      <div className='px-6 flex justify-between'>

        {/* Graveyard */}
        <div>
          <div className='flex text-white gap-1 justify-between items-center'>
            <Image src={'/assets/stats/grave.svg'} alt="Graveyard" width={36} height={10} className='' />
            <p>Graveyard</p>
          </div>
          <p className='mt-2 text-white text-2xl text-center'>{totalKills}</p>
        </div>

        <div>
          <div className='flex text-white gap-1 justify-between items-center'>
            <p>❤️</p>
            <p>Survived</p>
          </div>
          <p className='mt-2 text-white text-2xl text-center'>{totalSurvivals}</p>
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
