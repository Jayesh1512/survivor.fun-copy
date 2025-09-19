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
  const [error, setError] = useState('');
  const router = useRouter();

  const validCodes = ["surviveinkorea", "surviveindelhi"];

  const handleJoinTournament = () => {
    const trimmedCode = tournamentCode.trim().toLowerCase();

    if (!trimmedCode) {
      setError('Please enter a tournament code');
      return;
    }

    if (validCodes.includes(trimmedCode)) {
      console.log('Joining tournament with code:', trimmedCode);
      setError('');
      // Redirect to mint token page
      router.push('/mint');
    } else {
      setError('Invalid tournament code');
    }
  };

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] h-[347px]">
      <div className="relative z-0 h-full w-full">
        <Image src={tournamentBg} alt="" aria-hidden fill sizes="390px" className="object-cover -z-10 pointer-events-none" />
        <div className="relative z-10 text-center text-white text-lg pt-18">

          {/* Search Bar Input Field */}
          <div className="mb-6 px-4 mt-12">
            <div className="relative z-10 w-[358px] h-[101px] flex items-center px-4">
              <Image src={searchBarBg} alt="" aria-hidden fill sizes="358px" className="object-cover -z-10 pointer-events-none" />
              <input
                type="text"
                value={tournamentCode}
                onChange={(e) => {
                  setTournamentCode(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="Enter tournament code"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-center"
              />
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Tournament Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={handleJoinTournament}
          className="relative overflow-hidden w-[358px] h-[74px] flex items-center justify-center text-white font-semibold text-[24px] hover:scale-105 transition-transform duration-200 active:scale-95"
        >
          <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Join Tournament</span>
        </Button>
      </div>
    </div>
  );
}
