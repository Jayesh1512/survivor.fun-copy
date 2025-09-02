"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

type Exchange = Record<string, string>;

type Narration = { story: string; result: "survived" | "died" };

export default function JudgementPageClient() {
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
                body: JSON.stringify({ scenario, finalDecision: decision, chatHistory }),
            });
            const data = (await res.json()) as { response?: string };
            let story = "";
            let result: "survived" | "died" = "died";
            try {
                const parsed = JSON.parse(data.response || "{}");
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
        router.push("/mint");
    }, [phase, fetchNarration, router]);

    if (loading) {
        return (
            <div className="text-white bg-collab-background relative h-screen bg-cover bg-center bg-no-repeat">
                <div className="flex items-center justify-center absolute -bottom-10">
                    <Image src="/assets/loading/thinking.webp" alt="Ghost" width={551} height={551} />
                </div>
            </div>
        )
    }
    else {
        return (
            <>
                {phase === "decision" && (
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
                        <div className="absolute top-20 right-0">
                            <div className="p-0">
                                <Image
                                    src="/assets/game/ghost.webp"
                                    alt="Ghost"
                                    width={250}
                                    height={250}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center absolute bottom-30">
                            <div className="relative bg-strategy-frame bg-center bg-no-repeat w-[388px] h-[354px] text-wrap">

                                <div className="absolute inset-0 p-6 flex items-center justify-center text-center">
                                    <p className="text-white text-[28px] font-extrabold leading-[36px]">
                                        {!decision && loading ? "Thinking…" : decision || "Couldn't decide. Lets try again."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button onClick={onContinue} disabled={loading} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                                Continue
                            </Button>
                        </div>

                    </div>
                )}

                {phase !== "decision" && narration && (
                    <div className="text-white bg-judge-background relative h-screen bg-cover bg-center bg-no-repeat">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center text-center bg-black/20 rounded-2xl p-4 w-[300px]">
                                <div className="p-1 mb-3">
                                    <Image src="/assets/characters/one.webp" alt="Agent" width={288}
                                        height={288}
                                        className="w-[288px] h-[288px] rounded-[27%]" />
                                </div>
                                <div className="whitespace-pre-line leading-relaxed max-h-[330px] overflow-y-auto no-scrollbar mt-4">
                                    {phase === "story" ? narration.story : narration.result === "survived" ? `${agentName} survived.` : `${agentName} died.`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <Button onClick={onContinue} disabled={loading} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                                {phase === "story" ? "Reveal Fate" : "Play Again"}
                            </Button>
                        </div>
                    </div>
                )}
            </>
        );
    }
}


