"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function TopBar() {
  const router = useRouter();

  const handleBack = () => {
    router.replace('/');
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0   px-4 py-3 h-[100px] flex items-center justify-between">
        {/* <div className="rounded-lg p-2">
        <Image
          src="/assets/sound.webp"
          alt="Sound"
          width={48}
          height={48}
        />
      </div> */}
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

        <Link href='/stats'>
          <div className="rounded-lg p-2 cursor-pointer transition-transform hover:scale-110 active:scale-95">
            <Image
              src="/assets/game/profile.png"
              alt="Profile"
              width={48}
              height={48}
            />
          </div>
        </Link>
      </div>
    </>
  );
}
