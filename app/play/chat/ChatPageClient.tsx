"use client";

import { useEffect, useMemo, useRef } from "react";
import { INITIAL_MESSAGE } from "@/lib/constants";
import { useChatURL } from '@/lib/hooks/useChatURL';
import { useChatAPI } from '@/lib/hooks/useChatAPI';
import { useChatTimer } from '@/lib/hooks/useChatTimer';
import { msToClock, formatMessages } from '@/lib/utils/chatUtils';
import TopBar from './components/TopBar';
import Image from 'next/image';
import chatBg from '@/public/assets/chat_bg.png';
import ScenarioArea from './components/ScenarioArea';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';

export default function ChatPageClient() {
    const { name, nft, scenario, goToJudgement } = useChatURL();
    const { history, isLoading, sendMessage, initializeHistory } = useChatAPI(scenario, nft, name);
    const { timeLeftMs, timeUp } = useChatTimer();

    const display = useMemo(() => formatMessages(history, name), [history, name]);

    const handleSend = async (message: string) => {
        await sendMessage(message, history);
    };

    // Auto-redirect to judgement exactly once when timer ends
    const redirectedRef = useRef(false);
    useEffect(() => {
        if (!timeUp || redirectedRef.current) return;
        redirectedRef.current = true;
        goToJudgement(history);
    }, [timeUp, goToJudgement, history]);

    // Initialize first message after name/scenario known
    useEffect(() => {
        if (history.length === 0) {
            initializeHistory(INITIAL_MESSAGE);
        }
    }, [history.length, initializeHistory]);

    return (
        <div className="relative h-screen flex flex-col overflow-hidden">
            <Image
                src={chatBg}
                alt="Chat background"
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                className="object-cover -z-10"
            />
            <TopBar
                timeLeft={msToClock(timeLeftMs)}
                onForceEnd={() => {
                    if (!redirectedRef.current) {
                    redirectedRef.current = true;
                    goToJudgement(history);
                    }
                }}
            />

            <ScenarioArea scenario={scenario} />
            <ChatArea messages={display} />
            <InputArea
                onSend={handleSend}
                isLoading={isLoading}
                timeUp={timeUp}
            />
        </div>
    );
}


