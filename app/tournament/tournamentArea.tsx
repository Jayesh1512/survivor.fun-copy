"use client";

import { useState } from 'react';
import Image from 'next/image';
import tournamentBg from '@/public/assets/game/tournament_code.svg';
import searchBarBg from '@/public/assets/game/search_bar.png';
import buttonBg from '@/public/assets/button.webp';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TournamentArea() {
  const [tournamentCode, setTournamentCode] = useState('');
  const router = useRouter();

  const handleJoinTournament = () => {
    if (tournamentCode.trim()) {
      console.log('Joining tournament with code:', tournamentCode);
      // Redirect to mint token page
      router.push('/mint');
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] h-[347px]">
      <div className="relative h-full w-full">
        <Image src={tournamentBg} alt="" aria-hidden fill sizes="390px" className="object-cover -z-10" />
        <div className="text-center text-white text-lg pt-18">

          {/* Search Bar Input Field */}
          <div className="mb-6 px-4 mt-12">
            <div className="relative w-[358px] h-[101px] flex items-center px-4">
              <Image src={searchBarBg} alt="" aria-hidden fill sizes="358px" className="object-cover -z-10" />
              <input
                type="text"
                value={tournamentCode}
                onChange={(e) => setTournamentCode(e.target.value)}
                placeholder="Enter tournament code"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Join Tournament Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          className="relative overflow-hidden w-[358px] h-[74px] flex items-center justify-center text-white font-semibold text-[24px] hover:scale-105 transition-transform duration-200 active:scale-95"
          onClick={handleJoinTournament}
        >
          <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Join Tournament</span>
        </Button>
      </div>
    </div>
  );
}
