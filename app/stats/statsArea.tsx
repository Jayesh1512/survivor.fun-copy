"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StatsArea({ totalgames = 0 }: { totalgames?: number }) {
    const router = useRouter();

    const handlePlayAgain = () => {
      router.push('/mint');
    };

    return (
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] h-[347px]">
        <div className="bg-stats h-full w-full bg-cover bg-center bg-no-repeat">
          <div className="text-center text-white text-lg pt-8">
            Total Games Played
            <p className="text-2xl font-bold">{totalgames}</p>
          </div>
        </div>
        {/* Try Again Button */}
        <div className="absolute bottom-10 right-6">
        <Button
          className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] text-[24px] font-bold flex items-center justify-center"
          onClick={handlePlayAgain}
        >
          Play Again
        </Button>
        </div>
      </div>
    );
  }