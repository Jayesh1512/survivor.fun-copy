import { useEffect, useState } from 'react';
import { CHAT_DURATION_MS } from '@/lib/constants';

export const useChatTimer = () => {
  const [startAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  const timeLeftMs = Math.max(0, startAt + CHAT_DURATION_MS - now);
  const timeUp = timeLeftMs <= 0;

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
