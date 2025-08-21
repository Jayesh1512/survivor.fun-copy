"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_DURATION_MS, DEFAULT_NFT, INITIAL_MESSAGE, scenarios } from "@/lib/constants";
import Image from 'next/image';

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
        <div className="bg-[#04022F] min-h-screen flex flex-col">
            {/* Top Bar */}
            <div className="bg-[#C131F5] px-4 py-3 h-[100px] flex items-center justify-between">
                <div className="rounded-lg p-2">
                    <Image
                        src="/assets/sound.svg"
                        alt="Sound"
                        width={48}
                        height={48}
                    />
                </div>
                <div className="text-white text-xl font-bold">
                    {msToClock(timeLeftMs)} s
                </div>
                <div className="rounded-lg p-2">
                    <Image
                        src="/assets/home.svg"
                        alt="Home"
                        width={48}
                        height={48}
                    />
                </div>
            </div>

            {/* Separator Line */}
            <div className="h-px bg-white opacity-30"></div>

            {/* Scenario Area */}
            <div className="bg-[#04022F] px-4 py-3">
                <div className="text-center text-white text-lg">
                    {scenario}
                </div>
            </div>

            {/* Separator Line */}
            <div className="h-px bg-white opacity-30"></div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-[#04022F]">
                {display.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 ${m.role === "nft" ? "justify-start" : "justify-end"}`}
                    >
                        {m.role === "nft" && (
                            <div className="w-10 h-10 rounded-full bg-purple-400 flex-shrink-0">
                                <Image
                                    src="/assets/characters/two.svg"
                                    alt="Character"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>
                        )}

                        <div className={`max-w-[70%] ${m.role === "nft" ? "order-2" : "order-1"}`}>
                            <div
                                className={`px-4 py-3 rounded-2xl ${m.role === "nft"
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-black"
                                    }`}
                            >
                                {m.text}
                            </div>
                        </div>

                        {m.role === "user" && (
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0 order-2">
                                <div className="w-full h-full rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold">
                                    A
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3">
                <div className="flex items-center gap-3 text-white">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                        placeholder="Type your suggestion..."
                        className="flex-1 bg-gray-700 text-white border-gray-600 rounded-xl px-4 py-3 h-[54px]"
                        autoFocus
                        disabled={timeUp}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || timeUp}
                    >
                        <Image
                            src="/assets/sendMessage.svg"
                            alt="Sound"
                            width={48}
                            height={48}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
}


