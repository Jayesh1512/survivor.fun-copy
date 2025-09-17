"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import collabBackground from "@/public/assets/game/collabBackground.webp";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastTimestamp = typeof performance !== "undefined" ? performance.now() : 0;
    let isComplete = false;
    let progressValue = 0;

    const getConnection = (): { effectiveType: string; downlink: number } => {
      const anyNavigator = navigator as any;
      const conn =
        anyNavigator?.connection ||
        anyNavigator?.mozConnection ||
        anyNavigator?.webkitConnection;
      return {
        effectiveType: conn?.effectiveType || "4g",
        downlink: typeof conn?.downlink === "number" ? conn.downlink : 10,
      };
    };

    const computeSpeedPctPerSec = (): number => {
      const { effectiveType, downlink } = getConnection();
      let base = 35; // % per second baseline
      if (effectiveType === "2g") base = 12;
      else if (effectiveType === "3g") base = 22;
      else if (effectiveType === "4g") base = 38;

      // Downlink refinement
      if (downlink < 1) base *= 0.6;
      else if (downlink < 2) base *= 0.8;
      else if (downlink > 10) base *= 1.15;

      // Document readiness hints
      if (document.readyState === "interactive") base *= 1.15;
      if (document.readyState === "complete") base *= 2.2;

      // If tab hidden, slow it down a bit to avoid jumping
      if (typeof document.hidden === "boolean" && document.hidden) base *= 0.7;

      // When we know it's complete, rush to 100
      if (isComplete) base = Math.max(base, 120);

      return base;
    };

    const onReadyStateChange = () => {
      if (document.readyState === "complete") {
        isComplete = true;
      }
    };

    const onWindowLoad = () => {
      isComplete = true;
    };

    document.addEventListener("readystatechange", onReadyStateChange);
    window.addEventListener("load", onWindowLoad);

    const step = (now: number) => {
      const deltaMs = Math.max(0, now - lastTimestamp);
      lastTimestamp = now;

      const cap = isComplete ? 100 : 94; // hold just before full until real completion
      const speed = computeSpeedPctPerSec();
      const increment = (speed * deltaMs) / 1000; // convert to %
      progressValue = Math.min(cap, progressValue + increment);
      setProgress(progressValue);

      if (progressValue < 100) {
        rafId = requestAnimationFrame(step);
      }
    };

    // Kick off
    if (document.readyState === "complete") {
      isComplete = true;
    }
    rafId = requestAnimationFrame((ts) => {
      lastTimestamp = ts;
      rafId = requestAnimationFrame(step);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("readystatechange", onReadyStateChange);
      window.removeEventListener("load", onWindowLoad);
    };
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
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          />

          {/* Loading text */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
            {progress < 100 ? "Loading..." : "Ready"}
          </div>
        </div>
      </div>
    </div>
  );
}
