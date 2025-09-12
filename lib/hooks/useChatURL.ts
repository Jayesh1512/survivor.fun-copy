import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_NFT, scenarios } from '@/lib/constants';
import { NFT } from '@/types/chat';

export const useChatURL = () => {
  const search = useSearchParams();
  const router = useRouter();

  const name = search.get("name") || "Character";
  const description = search.get("description") || DEFAULT_NFT.bio;
  const nftParam = search.get("nft") || "";
  const scenarioParam = search.get("scenario") || "";

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

  const goToJudgement = useCallback((history: any[]) => {
    const params = new URLSearchParams({
      scenario,
      agentName: name,
      history: encodeURIComponent(JSON.stringify(history)),
    });
    router.push(`/play/judgement?${params.toString()}`);
  }, [router, scenario, name]);

  return {
    name,
    nft,
    scenario,
    goToJudgement,
  };
};
