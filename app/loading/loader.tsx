"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import collabBackground from "@/public/assets/game/collabBackground.webp";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white relative h-screen overflow-hidden">
      {/* Background */}
      <Image
        src={collabBackground}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10"
      />

      <div className="flex flex-col items-center justify-end h-full pb-12">
        {/* Ghost - slightly overlapping loader */}
        <div className="relative -mb-[70px] z-0">
          <Image
            src="/assets/loading/ghost.svg"
            alt="Ghost"
            width={451}
            height={451}
          />
        </div>

        {/* Loader container */}
        <div className="relative w-[358px] h-[74px] z-10">
          {/* Loader background image */}
          <Image
            src="/assets/loading/loader.svg"
            alt="Loader Background"
            fill
            className="object-contain"
          />

          {/* Orange progress bar */}
          <div
            className="absolute left-[10px] top-[4px] h-[66px] bg-orange-400 rounded-[16px] transition-all duration-300 ease-out"
            style={{ width: `${(progress / 100) * 338}px` }}
          />

          {/* Loading text */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}
