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
    <div className="absolute bottom-0 transform -translate-x-1/2 w-full h-[347px]">
      <div className="relative z-0 h-full w-full">
      <Image
        src={tournamentBg}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover -z-10 pointer-events-none"
      />

    <div className="relative z-10 text-center text-white text-lg pt-18">
      {/* Search Bar Input Field */}
      <div className="mb-6 px-4 mt-12">
        <div className="relative z-10 w-full h-[101px] flex items-center px-4">
          <Image
  src={tournamentBg}
  alt=""
  aria-hidden="true"
  fill
  sizes="100vw"
  className="object-cover -z-10 pointer-events-none"
/>

          <input
            type="text"
            value={tournamentCode}
            onChange={(e) => {
              setTournamentCode(e.target.value);
              setError('');
            }}
            placeholder="Enter tournament code"
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-center"
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm mt-2 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
      </div>

  {/* Join Tournament Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[358px]">
        <Button
          onClick={handleJoinTournament}
          className="relative overflow-hidden w-full h-[74px] flex items-center justify-center text-white font-semibold text-[24px] hover:scale-105 transition-transform duration-200 active:scale-95"
        >
          <Image src={buttonBg} alt="" aria-hidden fill sizes="100vw" className="object-cover z-0 pointer-events-none" />
          <span className="relative z-10">Join Tournament</span>
        </Button>
      </div>
    </div>

  );
}
