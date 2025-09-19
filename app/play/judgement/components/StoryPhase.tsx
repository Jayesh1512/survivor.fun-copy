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
    <div className="text-white relative isolate overflow-hidden h-screen">
      <Image
        src={judgeBackground}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10 pointer-events-none"
      />
      {/* Character image circle at top */}
      <div className="absolute flex flex-col justify-center items-center top-16 left-1/2 -translate-x-1/2">
        <Image
          src="/assets/characters/one.webp"
          alt="Agent"
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full border-4 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 border-purple-900 shadow-lg"
        />
        <div className="w-[300px] mt-24 h-[100px] flex flex-col items-center justify-center px-7 text-center space-y-1">
          <p className="text-sm leading-relaxed">{narration.story}</p>
        </div>
      </div>

      {/* Ghost bottom-left */}
      <div className="absolute -bottom-4 left-0">
        <Image
          src="/assets/judgement/judge.svg"
          alt="Judge"
          width={257}
          height={257}
        />
      </div>
      {/* Text content*/}


      {/* Button bottom-right */}
      <div className="absolute bottom-10 right-6">
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
