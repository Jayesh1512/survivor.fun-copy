import { useEffect, useState } from 'react';
import { CHAT_DURATION_MS } from '@/lib/constants';

export const useChatTimer = (agentKey: string) => {
  const [startAt, setStartAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  const startKey = `startTime:${agentKey}`;
  const historyKey = `History:${agentKey}`;

  const timeLeftMs = Math.max(0, startAt + CHAT_DURATION_MS - now);
  const timeUp = timeLeftMs <= 0;

  // Initialize or restore per-agent timer start
  useEffect(() => {
    try {
      const saved = localStorage.getItem(startKey);
      if (!saved) {
        const nowTs = Date.now();
        setStartAt(nowTs);
        localStorage.setItem(startKey, String(nowTs));
      } else {
        setStartAt(Number(saved));
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentKey]);

  // On time up, clear per-agent timer and history keys
  useEffect(() => {
    if (!timeUp) return;
    try {
      localStorage.removeItem(startKey);
      localStorage.removeItem(historyKey);
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  // Timer tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  return {
    timeLeftMs,
    timeUp,
  };
};
