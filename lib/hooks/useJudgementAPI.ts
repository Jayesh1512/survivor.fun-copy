import { useCallback, useEffect, useRef, useState } from 'react';
import { Exchange, Narration, PersuasionReport, AnalyserResult } from '@/types/judgement';
import { useBlockchain } from '@/lib/hooks/useBlockchain';

export const useJudgementAPI = (scenario: string, agentName: string, chatHistory: Exchange[]) => {
  const [decision, setDecision] = useState<string>("");
  const [narration, setNarration] = useState<Narration | null>(null);
  const [persuasion, setPersuasion] = useState<PersuasionReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAgentId } = useBlockchain();

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
          body: JSON.stringify({ scenario, agentName, chatHistory, agentId: activeAgentId ? activeAgentId.toString() : undefined }),
        });
        const data = (await res.json()) as { response?: string };
        try {
          const parsed = JSON.parse(data.response || "{}") as (AnalyserResult & { expectedOutcome?: "survived" | "died"; txHash?: string });
          setDecision((parsed.decision || "").trim());
          setPersuasion(parsed.persuasion || null);
        } catch {
          setDecision((data.response || "").trim());
          setPersuasion(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [scenario, agentName, chatHistory, activeAgentId]);

  const fetchNarration = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, finalDecision: decision, agentName, chatHistory, persuasion }),
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
    persuasion,
    loading,
    fetchNarration,
  };
};
