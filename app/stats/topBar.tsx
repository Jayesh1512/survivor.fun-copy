"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="absolute top-0 left-0 right-0 px-4 py-3 h-[80px] md:h-[100px] flex items-center justify-between z-50 pointer-events-none">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="rounded-lg p-2 transition-transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
      >
        <Image
          src="/assets/game/back_button.svg"
          alt="Back"
          width={40}
          height={40}
          className="md:w-12 md:h-12"
        />
      </button>

      {/* Title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl font-semibold pointer-events-none">
        Stats
      </div>
    </div>
  );
}
