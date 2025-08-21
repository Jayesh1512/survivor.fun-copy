"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_DURATION_MS, DEFAULT_NFT, INITIAL_MESSAGE, scenarios } from "@/lib/constants";

type Exchange = { [characterName: string]: string } | { user: string };

function msToClock(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
}

export default function ChatPage() {
    const search = useSearchParams();
    const router = useRouter();

    const name = search.get("name") || "Character";
    const description = search.get("description") || DEFAULT_NFT.bio;
    const nftParam = search.get("nft") || "";
    const scenarioParam = search.get("scenario") || "";
    const traitsParam = search.get("traits") || ""; // legacy support

    const nft = useMemo(() => {
        if (nftParam) {
            try {
                return JSON.parse(decodeURIComponent(nftParam));
            } catch { }
        }
        return { ...DEFAULT_NFT, name, bio: description };
    }, [nftParam, name, description]);

    const scenario = useMemo(() => {
        if (scenarioParam.trim()) return scenarioParam;
        const all = scenarios(name);
        return all[Math.floor(Math.random() * all.length)];
    }, [scenarioParam, name]);

    // Ensure URL has canonical scenario/nft so refreshes keep state
    useEffect(() => {
        const needsScenario = !scenarioParam.trim();
        const needsNft = !nftParam.trim();
        if (!needsScenario && !needsNft) return;
        const params = new URLSearchParams(Array.from(search.entries()));
        if (needsScenario) params.set("scenario", scenario);
        if (needsNft) params.set("nft", encodeURIComponent(JSON.stringify(nft)));
        // Avoid pushing a new history entry
        router.replace(`/play/chat?${params.toString()}`);
    }, [search, router, scenarioParam, nftParam, scenario, nft]);

    const [history, setHistory] = useState<Exchange[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [startAt] = useState<number>(Date.now());
    const [now, setNow] = useState<number>(Date.now());
    const durationMs = CHAT_DURATION_MS;

    const timeLeftMs = Math.max(0, startAt + durationMs - now);
    const timeUp = timeLeftMs <= 0;

    // Scroll management
    const endRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    // Timer tick
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(id);
    }, []);

    const display = useMemo(() => {
        const messages: { role: "nft" | "user"; text: string }[] = [];
        history.forEach((ex) => {
            if ("user" in ex) messages.push({ role: "user", text: ex.user });
            else {
                const text = ex[name as keyof typeof ex] as string;
                messages.push({ role: "nft", text });
            }
        });
        return messages;
    }, [history, name]);

    const handleSend = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading || timeUp) return;
        setIsLoading(true);
        const current = input; // capture before clearing
        setInput("");

        // Build updated history locally to use in the request
        const updatedHistory: Exchange[] = [...history, { user: trimmed }];
        setHistory(updatedHistory);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scenario,
                    nft: nft,
                    chatHistory: updatedHistory,
                    userResponse: trimmed,
                }),
            });
            const data = (await res.json()) as { response?: string; error?: string };
            const botText = data.response?.trim() || "";
            setHistory((prev) => [...prev, { [name]: botText } as Exchange]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            // restore focus to input after send completes
            try {
                const el = document.querySelector<HTMLInputElement>('input[data-slot="input"]');
                el?.focus();
            } catch { }
        }
    }, [input, isLoading, timeUp, scenario, nft, history]);

    const goContinue = useCallback(() => {
        const params = new URLSearchParams({
            scenario,
            agentName: name,
            history: encodeURIComponent(JSON.stringify(history)),
        });
        router.push(`/play/judgement?${params.toString()}`);
    }, [router, scenario, name, history]);

    // Auto-redirect to judgement exactly once when timer ends
    const redirectedRef = useRef(false);
    useEffect(() => {
        if (!timeUp || redirectedRef.current) return;
        redirectedRef.current = true;
        goContinue();
    }, [timeUp, goContinue]);

    // Initialize first message after name/scenario known
    useEffect(() => {
        if (history.length === 0) {
            setHistory([{ [name]: INITIAL_MESSAGE } as Exchange]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, scenario]);

    return (
        <div className="mx-auto max-w-md h-[calc(100vh-2rem)] p-4 flex flex-col gap-3">
            <div className="space-y-1">
                <div className="text-xs opacity-80">Your Scenario</div>
                <div className="text-lg font-semibold">{scenario}</div>
                <div className="text-xs opacity-70">{name} · Time left {msToClock(timeLeftMs)}</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 rounded-md p-2 bg-black/10">
                {display.map((m, idx) => (
                    <div
                        key={idx}
                        className={m.role === "nft" ? "text-left" : "text-right"}
                    >
                        <span
                            className={
                                "inline-block px-3 py-2 rounded-2xl max-w-[85%] " +
                                (m.role === "nft" ? "bg-purple-600 text-white" : "bg-white text-black")
                            }
                        >
                            {m.text}
                        </span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <div className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Type your suggestion..."
                    autoFocus
                    disabled={timeUp}
                />
                <Button onClick={handleSend} disabled={isLoading || timeUp}>
                    Send
                </Button>
            </div>

            {/* No continue button; auto-redirect when time is up */}
        </div>
    );
}


