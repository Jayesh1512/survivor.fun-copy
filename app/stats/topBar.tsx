"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function TopBar() {
  const router = useRouter();

  return (
    <>
      <div className="absolute top-0 left-0 right-0 px-4 py-3 h-[100px] flex items-center justify-between">
        {/* <div className="rounded-lg p-2">
        <Image
          src="/assets/sound.webp"
          alt="Sound"
          width={48}
          height={48}
        />
      </div> */}
        <div className="rounded-lg p-2">
          <Image
            src="/assets/game/back_button.svg"
            alt="Sound"
            width={48}
            height={48}
            onClick={() => router.back()}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-semibold">
          Stats
        </div>
        {/* <div className="rounded-lg p-2">
          <Image
            src="/assets/game/profile.png"
            alt="Profile"
            width={48}
            height={48}
          />
        </div> */}
      </div>
      <Link href="/mint">
        <div className="rounded-lg p-2 absolute top-18 left-4">
          <Image
            src="/assets/home.webp"
            alt="Home"
            width={48}
            height={48}
          />
        </div>
      </Link>
    </>
  );
}
