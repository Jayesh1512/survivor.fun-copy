"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import buttonBg from '@/public/assets/button.webp';
import { useRouter } from 'next/navigation';

export default function StatsArea({ totalgames = 0 }: { totalgames?: number }) {
  const router = useRouter();

  const handlePlayAgain = () => {
    router.push('/mint');
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] h-[347px]">
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/stats/stats.svg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="text-center text-white text-lg pt-8">
          Total Games Played
          <p className="text-2xl font-bold">{totalgames}</p>
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
