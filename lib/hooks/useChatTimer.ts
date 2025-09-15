import { useEffect, useState } from 'react';
import { CHAT_DURATION_MS } from '@/lib/constants';

export const useChatTimer = () => {
  const [startAt,setStartAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  const timeLeftMs = Math.max(0, startAt + CHAT_DURATION_MS - now);
  const timeUp = timeLeftMs <= 0;

  useEffect(()=>{
    const saved = localStorage.getItem('startTime');
    if(!saved){
      setStartAt(Date.now());
      localStorage.setItem('startTime', String(startAt));
    }else{
      setStartAt(Number(localStorage.getItem('startTime')));
    }
  },[])
  useEffect(() => {
    if (timeUp) {
      localStorage.removeItem("startTime");
    }
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
