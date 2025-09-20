import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JudgementPhase, Narration } from '@/types/judgement';

interface UseJudgementPhaseProps {
  fetchNarration: () => Promise<void>;
  narration: Narration | null;
}

export const useJudgementPhase = ({ fetchNarration, narration }: UseJudgementPhaseProps) => {
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
      return;
    }
    const ts = Date.now();
    if (narration?.result === "died") {
      router.push(`/mint`);
      return;
    }
    router.push(`/mint`);
  }, [phase, fetchNarration, router, narration]);

  return {
    phase,
    onContinue,
  };
};
