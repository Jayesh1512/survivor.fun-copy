"use client";

import { useState } from "react";
import Image from "next/image";
import tournamentBg from "@/public/assets/game/tournament_code.svg";
import searchBarBg from "@/public/assets/game/search_bar.png";
import buttonBg from "@/public/assets/button.webp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TournamentArea() {
  const [tournamentCode, setTournamentCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validCodes = ["surviveinkorea", "surviveindelhi"];

  const handleJoinTournament = () => {
    const trimmed = tournamentCode.trim().toLowerCase();
    if (!trimmed) {
      setError("Please enter a tournament code");
      return;
    }
    if (!validCodes.includes(trimmed)) {
      setError("Invalid tournament code");
      return;
    }
    setError("");
    router.push("/mint");
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-[347px]">
      <div className="relative z-0 h-full w-full">
        {/* Background */}
        <Image
          src={tournamentBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover pointer-events-none -z-10"
        />

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="relative z-10 text-white text-lg pt-18">
          <div className="mb-4 mt-12 flex items-center justify-center">
            <div className="relative w-[90%] h-[101px] flex items-center px-4 overflow-hidden rounded-[24px]">
              {/* Background image for search bar */}
              <Image
                src={searchBarBg}
                alt=""
                fill
                sizes="100vw"
                className="object-cover pointer-events-none -z-10"
              />

              {/* Input field */}
              <input
                type="text"
                value={tournamentCode}
                onChange={(e) => {
                  setTournamentCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter tournament code"
                className="
                  w-full bg-transparent text-white text-center
                  placeholder-gray-400 focus:outline-none
                "
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </div>
      </div>

      {/* ---------------- JOIN BUTTON ---------------- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[358px]">
        <Button
          onClick={handleJoinTournament}
          className="
            relative overflow-hidden w-full h-[74px]
            flex items-center justify-center
            text-white font-semibold text-[24px]
            hover:scale-105 active:scale-95 transition-transform duration-200
          "
        >
          <Image
            src={buttonBg}
            alt=""
            fill
            sizes="100vw"
            className="object-cover pointer-events-none -z-10"
          />
          <span className="relative z-10">Join Tournament</span>
        </Button>
      </div>
    </div>
  );
}
