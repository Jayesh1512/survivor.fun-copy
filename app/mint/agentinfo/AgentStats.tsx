"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from 'next/image';

export default function AgentStats() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentName = searchParams.get("agentName") || "Agent";

  const handleStartGame = () => {
    router.push('/play/chat');
  };

  return (
    <div className="w-[390px] h-[364px] bg-[#030229] rounded-t-[30px] rounded-b-[30px] p-6 flex flex-col text-[#909EBC]">
      {/* Header with character image and name */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
          <Image
            src="/assets/characters/one.webp"
            alt="Agent"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-purple-400">Name</p>
          <h2 className="text-white text-2xl font-semibold">{agentName}</h2>
        </div>
      </div>

      {/* Stats Row */}
      <div className="w-[354px] h-[36px] mb-6 text-sm">
        <div className="flex items-center">
          <span className="text-medium">
            COMPLIANCE: <span className="font-semibold text-white">56</span>
          </span>
          <span className="mx-2 text-white">|</span>
          <span className="text-medium">
            CREATIVITY: <span className="font-bold text-white">21</span>
          </span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-medium">
            UNHINGED-NESS: <span className="font-semibold text-white">88</span>
          </span>
          <span className="mx-2 text-white">|</span>
          <span className="text-medium">
            MOTIVATION TO SURVIVE: <span className="font-semibold text-white">35</span>
          </span>
        </div>
      </div>


      {/* Bio Section */}
      <div className="flex-1 mb-4">
        <h3 className="text-purple-400 text-lg font-semibold mb-2">Bio</h3>
        <p className="text-sm leading-relaxed">
          Super cool Baby Punk constantly doing random stuff on their bike. Is a daredevil
        </p>
      </div>

      {/* Start Game Button */}
      <div className="flex justify-start">
        <button
          onClick={handleStartGame}
          className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] text-[24px] text-white font-semibold flex items-center justify-center"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

