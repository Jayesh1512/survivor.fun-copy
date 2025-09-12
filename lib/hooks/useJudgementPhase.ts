import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JudgementPhase, Narration } from '@/types/judgement';

interface UseJudgementPhaseProps {
  fetchNarration: () => Promise<void>;
  narration: Narration | null;
  killAgent: () => Promise<any>;
}

export const useJudgementPhase = ({ fetchNarration, narration, killAgent }: UseJudgementPhaseProps) => {
  const router = useRouter();
  const [phase, setPhase] = useState<JudgementPhase>("decision");

  const onContinue = useCallback(async () => {
    if (phase === "decision") {
      await fetchNarration();
      setPhase("story");
      return;
    }
    if (phase === "story") {
      setPhase("result");
      console.log(narration?.result);
      if (narration?.result === "died") {
        await killAgent();
        await new Promise(resolve => setTimeout(resolve, 6000));
        return;
      }
      return;
    }
    router.push("/mint");
  }, [phase, fetchNarration, narration?.result, killAgent, router]);

  return {
    phase,
    onContinue,
  };
};
