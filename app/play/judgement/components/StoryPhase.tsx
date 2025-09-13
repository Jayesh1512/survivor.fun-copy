import Image from 'next/image';
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
    <div className="text-white bg-judge-background relative overflow-hidden h-screen bg-cover bg-center bg-no-repeat">
      {/* Character image circle at top */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2">
        <Image
          src="/assets/characters/one.webp"
          alt="Agent"
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full border-4 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 border-purple-900 shadow-lg"
        />
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
      <div className="absolute bottom-110 left-10 w-[300px] h-[100px] flex flex-col items-center justify-center px-7 text-center space-y-1">
        <p className="text-s leading-relaxed">{narration.story}</p>
      </div>

      {/* Button bottom-right */}
      <div className="absolute bottom-10 right-6">
        <Button
          onClick={onContinue}
          disabled={loading}
          className="bg-button-small bg-cover bg-center bg-no-repeat w-[129px] h-[58px] text-[18px] font-bold flex items-center justify-center"
        >
          Reveal Fate
        </Button>
      </div>
    </div>
  );
}