import Image from 'next/image';
import judgeBackground from '@/public/assets/game/judgement_bg.png';
import buttonSmallBg from '@/public/assets/button_small.png';
import { Button } from '@/components/ui/button';
import { Narration } from '@/types/judgement';

interface StoryPhaseProps {
  narration: Narration;
  agentName: string;
  loading: boolean;
  onContinue: () => void;
}

export default function StoryPhase({ narration, agentName, loading, onContinue }: StoryPhaseProps) {
  return (
    <div className="relative isolate h-screen overflow-hidden text-white">
      {/* Background */}
      <Image
        src={judgeBackground}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10 pointer-events-none"
      />

      {/* Fixed character + ghost */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <Image
          src="/assets/characters/one.webp"
          alt="Agent"
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full border-4 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 border-purple-900 shadow-lg"
        />
      </div>
      <div className="absolute -bottom-4 left-0 z-10">
        <Image
          src="/assets/judgement/judge.svg"
          alt="Judge"
          width={257}
          height={257}
        />
      </div>

      {/* Scrollable story text */}
      <div className="absolute top-[25%] bottom-[100px] left-0 right-0 overflow-y-auto px-6">
        <div className="max-w-[300px] mx-auto flex flex-col items-center text-center space-y-1">
          <p className="text-md leading-relaxed">{narration.story}</p>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="absolute bottom-10 right-6 z-20">
        <Button
          onClick={onContinue}
          disabled={loading}
          className="relative overflow-hidden w-[129px] h-[58px] text-[18px] font-bold flex items-center justify-center"
        >
          <Image src={buttonSmallBg} alt="" aria-hidden fill sizes="129px" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Reveal Fate</span>
        </Button>
      </div>
    </div>
  );
}

