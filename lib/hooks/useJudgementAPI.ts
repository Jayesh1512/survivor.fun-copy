import { useCallback, useEffect, useRef, useState } from 'react';
import { Exchange, Narration } from '@/types/judgement';

export const useJudgementAPI = (scenario: string, agentName: string, chatHistory: Exchange[]) => {
  const [decision, setDecision] = useState<string>("");
  const [narration, setNarration] = useState<Narration | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Get decision once per unique param set (avoid double calls in Strict Mode)
  const requestKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const key = JSON.stringify({ scenario, agentName, chatHistory });
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
  }, [scenario, agentName, chatHistory]);

  const fetchNarration = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, finalDecision: decision, agentName, chatHistory }),
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
        result = "died";
      }
      setNarration({ story, result });
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [scenario, decision, agentName, chatHistory]);

  return {
    decision,
    narration,
    loading,
    fetchNarration,
  };
};
