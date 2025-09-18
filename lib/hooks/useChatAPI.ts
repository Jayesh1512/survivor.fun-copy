import { useCallback, useState } from 'react';
import { Exchange, NFT } from '@/types/chat';

export const useChatAPI = (scenario: string, nft: NFT, name: string) => {
  const [history, setHistory] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (input: string, currentHistory: Exchange[]) => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const trimmed = input.trim();

    const updatedHistory: Exchange[] = [...currentHistory, { user: trimmed }];
    setHistory(updatedHistory);
    localStorage.setItem('History' , JSON.stringify(updatedHistory))

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
        localStorage.setItem("History", JSON.stringify(newHistory));
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
  }, [scenario, nft, name, isLoading]);

  const initializeHistory = useCallback((initialMessage: string) => {
    setHistory([{ [name]: initialMessage } as Exchange]);
  }, [name]);

  return {
    history,
    isLoading,
    sendMessage,
    initializeHistory,
  };
};
