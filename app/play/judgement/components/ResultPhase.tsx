import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Narration } from '@/types/judgement';

interface ResultPhaseProps {
  narration: Narration;
  agentName: string;
  loading: boolean;
  onContinue: () => void;
}

export default function ResultPhase({ narration, agentName, loading, onContinue }: ResultPhaseProps) {
  const isDead = narration.result === "died";

  return (
    <div className="text-white bg-judge-background relative h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
      
      {/* Character container */}
      <div className="relative -bottom-4 flex flex-col items-center space-y-3">
        {/* Character Image */}
        <Image
          src="/assets/characters/one.webp"
          alt="Agent"
          width={295}
          height={274}
          className={` ${isDead ? "grayscale" : ""}`}
        />

        
        {isDead && (
          <Image
            src="/assets/game/fire.svg"
            alt="Fire"
            width={295}
            height={274}
            className="absolute -bottom-0 left-40 -translate-x-1/2"
          />
        )}
        
      </div>
      

      {/* RIP / Survived Banner */}
      <div className="absolute top-54 left-0 w-[390px] h-[50px] bg-white/50 text-white py-2 text-center font-bold text-3xl">
        {isDead ? "💀 RIP" : "Survived"}
      </div>
      <div className='absolute top-44'>
        <p className="text-xl font-bold">
          {isDead ? `You killed ${agentName}` : `${agentName} survived`}
        </p>
      </div>
      {/* Ghost bottom-left */}
      <div className="absolute -bottom-15 left-1">
        <Image
          src="/assets/judgement/judge.svg"
          alt="Judge"
          width={257}
          height={257}
        />
      </div>

      {/* Button bottom-right */}
      <div className="absolute bottom-10 right-6">
        <Button
          onClick={onContinue}
          disabled={loading}
          className="bg-button-small bg-cover bg-center bg-no-repeat w-[129px] h-[58px] text-[18px] font-bold flex items-center justify-center"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
}
