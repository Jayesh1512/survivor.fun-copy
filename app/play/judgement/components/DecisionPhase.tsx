import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface DecisionPhaseProps {
  decision: string;
  loading: boolean;
  onContinue: () => void;
}

export default function DecisionPhase({ decision, loading, onContinue }: DecisionPhaseProps) {
  return (
    <div className="text-white bg-collab-background relative h-screen bg-cover bg-center bg-no-repeat">
      {/* Sound Button - Top Left */}
      <div className="absolute top-3 left-3">
        <div className="rounded-lg p-0">
          <Image
            src="/assets/sound.webp"
            alt="Sound"
            width={48}
            height={48}
          />
        </div>
      </div>
      
      <div className="absolute top-20 right-0 z-20">
        <div className="p-0">
          <Image
            src="/assets/game/ghost.webp"
            alt="Ghost"
            width={250}
            height={250}
          />
        </div>
      </div>
      
      <div className="flex absolute bottom-30">
        <div className="relative left-4 w-[358px] h-[314px]">
          <Image
            src="/assets/game/strategyFrame.webp" 
            alt="Survival Strategy Frame"
            width={358}
            height={314}
            className="w-full h-full object-contain"
          />

          {/* Inner text content (overlayed on top of the PNG) */}
          <div className="absolute inset-0 p-6 flex items-center justify-center text-center">
            <p className="text-white text-[24px] font-extrabold leading-[32px] drop-shadow">
              {!decision && loading
                ? "Thinking…"
                : decision || "Couldn't decide. Let's try again."}
            </p>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex items-center justify-center">
        <Button
          onClick={onContinue}
          disabled={loading}
          className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute text-[24px] font-bold bottom-10 flex items-center justify-center"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
