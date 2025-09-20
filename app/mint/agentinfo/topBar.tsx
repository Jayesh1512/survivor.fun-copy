"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const router = useRouter();

  const handleHome = () => {
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/stats');
  };

  return (
    <div className="fixed top-0 left-0 right-0 px-4 py-3 h-[100px] flex items-center justify-between z-50 pointer-events-none">
      {/* Home Button */}
      <button
        onClick={handleHome}
        className="rounded-lg p-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
      >
        <Image
          src="/assets/home.webp"
          alt="Home"
          width={48}
          height={48}
        />
      </button>

      {/* Profile Button */}
      <button
        onClick={handleProfile}
        className="rounded-lg p-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
      >
        <Image
          src="/assets/game/profile.png"
          alt="Profile"
          width={48}
          height={48}
        />
      </button>
    </div>
  );
}
