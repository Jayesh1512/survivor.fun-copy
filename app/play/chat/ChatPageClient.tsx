"use client";

import { useEffect, useState, useRef } from "react";
import { INITIAL_MESSAGE } from "@/lib/constants";
import { useChatURL } from "@/lib/hooks/useChatURL";
import { useChatAPI } from "@/lib/hooks/useChatAPI";
import { useChatTimer } from "@/lib/hooks/useChatTimer";
import { msToClock, formatMessages } from "@/lib/utils/chatUtils";
import TopBar from "./components/TopBar";
import Image from "next/image";
import chatBg from "@/public/assets/chat_bg.png";
import ScenarioArea from "./components/ScenarioArea";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";
import { Exchange } from "@/types/chat";

export default function ChatPageClient() {
  const { name, nft, scenario, agentKey, goToJudgement } = useChatURL();
  const { history, isLoading, sendMessage, initializeHistory, ready } = useChatAPI(
    scenario,
    nft,
    name,
    agentKey
  );
  const { timeLeftMs, timeUp } = useChatTimer(agentKey);

  const [display, setDisplay] = useState<{ role: "nft" | "user"; text: string }[]>([]);

  // Load past messages from per-agent localStorage once
  useEffect(() => {
    const past = localStorage.getItem(`History:${agentKey}`);
    if (past) {
      try {
        const parsed: Exchange[] = JSON.parse(past);
        const formatted = formatMessages(parsed, name);
        setDisplay(formatted); // initial display only
      } catch (err) {
        console.error("Failed to parse past history:", err);
      }
    }
  }, [name, agentKey]);

  // Merge live history messages with localStorage messages
  useEffect(() => {
    const formatted = formatMessages(history, name);
    setDisplay((prev) => {
      // Combine old localStorage messages + live history, avoiding duplicates
      const existingTexts = new Set(prev.map((m) => m.text));
      const combined = [...prev];
      formatted.forEach((m) => {
        if (!existingTexts.has(m.text)) combined.push(m);
      });
      return combined;
    });
  }, [history, name]);

  const handleSend = async (message: string) => {
    await sendMessage(message, history);
  };

  const redirectedRef = useRef(false);
  useEffect(() => {
    if (!timeUp || redirectedRef.current) return;
    redirectedRef.current = true;
    goToJudgement(history);
  }, [timeUp, goToJudgement, history]);

  useEffect(() => {
    if (!ready) return;
    if (history.length === 0) {
      initializeHistory(INITIAL_MESSAGE);
    }
  }, [ready, history.length, initializeHistory]);

  return (
    <div className="relative isolate h-screen flex flex-col overflow-hidden">
      <Image
        src={chatBg}
        alt="Chat background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10 pointer-events-none"
      />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <TopBar
          timeLeft={msToClock(timeLeftMs)}
          scenario={scenario}
          agentName={name}
          onDone={() => goToJudgement(history)}
        />
        <ScenarioArea scenario={scenario} />
      </div>

      {/* Scrollable chat */}
      <div className="flex-1 flex flex-col pt-[35%] z-10 overflow-hidden">
        <ChatArea messages={display} />
        <InputArea onSend={handleSend} isLoading={isLoading} timeUp={timeUp} />
      </div>
    </div>


  );
}
