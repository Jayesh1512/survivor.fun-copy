"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Exchange = Record<string, string>;

type Narration = { story: string; result: "survived" | "died" };

export default function JudgementPage() {
    const search = useSearchParams();
    const router = useRouter();

    const scenario = search.get("scenario") || "";
    const agentName = search.get("agentName") || "Character";
    const historyParam = search.get("history") || "";
    const chatHistory: Exchange[] = useMemo(() => {
        try {
            return JSON.parse(decodeURIComponent(historyParam));
        } catch {
            return [];
        }
    }, [historyParam]);

    const [decision, setDecision] = useState<string>("");
    const [phase, setPhase] = useState<"decision" | "story" | "result">("decision");
    const [narration, setNarration] = useState<Narration | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Get decision once per unique param set (avoid double calls in Strict Mode)
    const requestKeyRef = useRef<string | null>(null);
    useEffect(() => {
        const key = JSON.stringify({ scenario, agentName, historyParam });
        if (requestKeyRef.current === key) return;
        requestKeyRef.current = key;

        (async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/analyser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scenario, agentName, chatHistory }),
                });
                const data = (await res.json()) as { response?: string };
                setDecision((data.response || "").trim());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [scenario, agentName, historyParam, chatHistory]);

    const fetchNarration = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/narrator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenario, finalDecision: decision }),
            });
            const data = (await res.json()) as { response?: string };
            let story = "";
            let result: "survived" | "died" = "died";
            try {
                const parsed = JSON.parse(data.response || "{}") as Narration;
                story = parsed.story || "";
                result = parsed.result || "died";
            } catch {
                story = data.response || "";
                result = story.toLowerCase().includes("surviv") ? "survived" : "died";
            }
            setNarration({ story, result });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [scenario, decision]);

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
        router.push("/play/setup");
    }, [phase, fetchNarration, router]);

    return (
        <div className="mx-auto max-w-md p-6 space-y-6">
            <div className="space-y-1">
                <div className="text-xs opacity-80">Your Scenario</div>
                <div className="text-lg font-semibold">{scenario}</div>
            </div>

            {phase === "decision" && (
                <div className="space-y-4">
                    <div className="text-sm font-medium opacity-80">Survival Strategy</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-lg leading-relaxed">
                        {!decision && loading ? "Thinking…" : decision || "Couldn't decide. Lets try again."}
                    </div>
                </div>
            )}

            {phase !== "decision" && narration && (
                <div className="space-y-4">
                    <div className="text-sm font-medium opacity-80">Judgement</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 whitespace-pre-line leading-relaxed">
                        {phase === "story" ? narration.story : narration.result === "survived" ? `${agentName} survived.` : `${agentName} died.`}
                    </div>
                </div>
            )}

            <Button className="w-full" onClick={onContinue} disabled={loading}>
                {phase === "decision" ? "Continue" : phase === "story" ? "Reveal Fate" : "Play Again"}
            </Button>
        </div>
    );
}


