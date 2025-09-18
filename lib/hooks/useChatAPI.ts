import { useCallback, useEffect, useState } from 'react';
import { Exchange, NFT } from '@/types/chat';

export const useChatAPI = (scenario: string, nft: NFT, name: string, agentKey: string) => {
  const [history, setHistory] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const historyKey = `History:${agentKey}`;
  const [ready, setReady] = useState(false);

  // Sync in-memory history with per-agent localStorage when agent changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Exchange[];
        if (Array.isArray(parsed)) setHistory(parsed);
        else setHistory([]);
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
    setReady(true);
  }, [historyKey]);

  const sendMessage = useCallback(async (input: string, currentHistory: Exchange[]) => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const trimmed = input.trim();

    // Ensure we include full saved history on first send after reload
    let baseHistory: Exchange[] = currentHistory;
    if (!baseHistory || baseHistory.length === 0) {
      try {
        const saved = localStorage.getItem(historyKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Exchange[];
          if (Array.isArray(parsed)) {
            baseHistory = parsed;
          }
        }
      } catch { }
    }

    const updatedHistory: Exchange[] = [...baseHistory, { user: trimmed }];
    setHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory))

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
      setHistory((prev) => {
        const newHistory = [...prev, { [name]: botText } as Exchange];
        localStorage.setItem(historyKey, JSON.stringify(newHistory));
        return newHistory;
      });


    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      try {
        const el = document.querySelector<HTMLInputElement>('input[data-slot="input"]');
        el?.focus();
      } catch { }
    }
  }, [scenario, nft, name, isLoading, historyKey]);

  const initializeHistory = useCallback((initialMessage: string) => {
    setHistory([{ [name]: initialMessage } as Exchange]);
  }, [name]);

  return {
    history,
    isLoading,
    sendMessage,
    initializeHistory,
    ready,
  };
};
