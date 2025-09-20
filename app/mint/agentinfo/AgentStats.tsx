"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import buttonBg from "@/public/assets/button.webp";
import { Button } from "@/components/ui/button";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/contracts/contractDetails";
import { DEFAULT_NFT, scenarios } from "@/lib/constants";

export default function AgentStats() {
  const router = useRouter();
  const { address } = useAccount();

  const [agentName, setAgentName] = useState(DEFAULT_NFT.name);
  const [stats, setStats] = useState({
    compliance: DEFAULT_NFT.attributes.compliance,
    creativity: DEFAULT_NFT.attributes.creativity,
    unhingedness: DEFAULT_NFT.attributes.unhingedness,
    motivationToSurvive: DEFAULT_NFT.attributes.motivation_to_survive
  });
  const [bio, setBio] = useState(DEFAULT_NFT.bio);
  const [image, setImage] = useState("/assets/characters/one.webp");
  const [scenario, setScenario] = useState("");

  // Generate random scenario on mount
  useEffect(() => {
    const allScenarios = scenarios(DEFAULT_NFT.name);
    const randomScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
    setScenario(randomScenario);
  }, []);

  // Fetch active agent ID
  const { data: activeAgentId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserActiveAgentId",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined };

  // Fetch agent details
  const { data: agentDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAgentDetails",
    args: typeof activeAgentId !== "undefined" ? [activeAgentId] : undefined,
  }) as { data: readonly [string, bigint, bigint, bigint, bigint, boolean] | undefined };

  useEffect(() => {
    if (agentDetails) {
      const [owner, compliance, creativity, unhingedness, motivation, isAlive] = agentDetails;
      setAgentName(DEFAULT_NFT.name);
      setStats({
        compliance: Number(compliance) || DEFAULT_NFT.attributes.compliance,
        creativity: Number(creativity) || DEFAULT_NFT.attributes.creativity,
        unhingedness: Number(unhingedness) || DEFAULT_NFT.attributes.unhingedness,
        motivationToSurvive: Number(motivation) || DEFAULT_NFT.attributes.motivation_to_survive,
      });
      setBio(DEFAULT_NFT.bio);
    }
  }, [agentDetails]);

  const handleStartGame = useCallback(() => {
    // Use either the agent data from contract or DEFAULT_NFT
    const nft = {
      name: agentName || DEFAULT_NFT.name,
      bio: bio || DEFAULT_NFT.bio,
      attributes: {
        compliance: stats.compliance || DEFAULT_NFT.attributes.compliance,
        creativity: stats.creativity || DEFAULT_NFT.attributes.creativity,
        motivation_to_survive: stats.motivationToSurvive || DEFAULT_NFT.attributes.motivation_to_survive,
        unhingedness: stats.unhingedness || DEFAULT_NFT.attributes.unhingedness,
      },
    };

    const params = new URLSearchParams({
      name: nft.name,
      scenario,
      nft: encodeURIComponent(JSON.stringify(nft)),
    });

    router.push(`/play/chat?${params.toString()}`);
  }, [scenario, router, agentName, bio, stats]);

  return (
    <div className="w-full max-w-[500px] mx-auto bg-[#030229] rounded-[30px] p-4 sm:p-6 flex flex-col text-[#909EBC]">
      {/* Header with character image and name */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
          <Image
            src={image}
            alt={agentName}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1"> {/* min-w-0 ensures text truncation works */}
          <p className="text-purple-400 text-sm sm:text-base">Name</p>
          <h2
            className="text-white text-xl sm:text-2xl font-semibold truncate"
            title={agentName} // Shows full name on hover
          >
            {agentName}
          </h2>
        </div>
      </div>

      {/* Stats Row - made responsive */}
      <div className="w-full mb-6 text-xs sm:text-sm space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-medium whitespace-nowrap">
            COMPLIANCE: <span className="font-semibold text-white">{stats.compliance}</span>
          </span>
          <span className="text-white hidden sm:inline">|</span>
          <span className="text-medium whitespace-nowrap">
            CREATIVITY: <span className="font-bold text-white">{stats.creativity}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-medium whitespace-nowrap">
            UNHINGED-NESS: <span className="font-semibold text-white">{stats.unhingedness}</span>
          </span>
          <span className="text-white hidden sm:inline">|</span>
          <span className="text-medium whitespace-nowrap">
            MOTIVATION TO SURVIVE: <span className="font-semibold text-white">{stats.motivationToSurvive}</span>
          </span>
        </div>
      </div>

      {/* Bio Section */}
      <div className="flex-1 mb-6">
        <h3 className="text-purple-400 text-base sm:text-lg font-semibold mb-2">Bio</h3>
        <p className="text-xs sm:text-sm leading-relaxed">{bio}</p>
      </div>

      {/* Start Game Button - responsive width */}
      <div className="flex justify-center">
        <button
          onClick={handleStartGame}
          className="relative overflow-hidden w-full max-w-[358px] h-[60px] sm:h-[74px] text-[20px] sm:text-[24px] text-white font-semibold flex items-center justify-center cursor-pointer"
        >
          <Image
            src={buttonBg}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 100vw, 358px"
            className="object-cover z-0 pointer-events-none"
          />
          <span className="relative z-10">Start Game</span>
        </button>
      </div>
    </div>
  );
}
