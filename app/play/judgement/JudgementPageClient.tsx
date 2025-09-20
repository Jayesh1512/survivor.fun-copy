"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import { Exchange } from '@/types/judgement';
import { useJudgementAPI } from '@/lib/hooks/useJudgementAPI';
import { useJudgementPhase } from '@/lib/hooks/useJudgementPhase';
import DecisionPhase from './components/DecisionPhase';
import StoryPhase from './components/StoryPhase';
import ResultPhase from './components/ResultPhase';
import LoadingScreen from './components/LoadingScreen';

export default function JudgementPageClient() {
    const search = useSearchParams();
    const router = useRouter();

    const scenario = search.get("scenario") || "";
    const agentName = search.get("agentName") || "Character";
    const forced = search.get("forced") || "";
    const historyParam = search.get("history") || "";
    const chatHistory: Exchange[] = useMemo(() => {
        try {
            return JSON.parse(decodeURIComponent(historyParam));
        } catch {
            return [];
        }
    }, [historyParam]);

    // Forced RIP path: skip analyser and narrator entirely
    if (forced === "dead") {
        const forcedNarration = { story: "", result: "died" as const };
        return (
            <ResultPhase
                narration={forcedNarration}
                agentName={agentName}
                loading={false}
                onContinue={() => router.push("/mint?requireMint=1")}>
            </ResultPhase>
        );
    }

    const { decision, narration, loading, fetchNarration } = useJudgementAPI(scenario, agentName, chatHistory);
    const { phase, onContinue } = useJudgementPhase({ fetchNarration, narration });

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            {/* Sound Button - Global */}
            {/* <div className="absolute top-3  left-3 z-50">
                <div className="rounded-lg p-0">
                    <Image
                        src="/assets/sound.webp"
                        alt="Sound"
                        width={48}
                        height={48}
                    />
                </div>
            </div> */}

            {phase === "decision" && (
                <DecisionPhase
                    decision={decision}
                    loading={loading}
                    onContinue={onContinue}
                />
            )}

            {phase === "story" && narration && (
                <StoryPhase
                    narration={narration}
                    agentName={agentName}
                    loading={loading}
                    onContinue={onContinue}
                />
            )}

            {phase === "result" && narration && (
                <ResultPhase
                    narration={narration}
                    agentName={agentName}
                    loading={loading}
                    onContinue={onContinue}
                />
            )}
        </>
    );
}


