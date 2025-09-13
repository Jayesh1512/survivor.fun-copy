import Image from 'next/image';
import Link from 'next/link';


export default function TopBar(){
  return (
    <>
    <div className="fixed top-0 left-0 right-0   px-4 py-3 h-[100px] flex items-center justify-between">
      <div className="rounded-lg p-2">
        <Image
          src="/assets/sound.webp"
          alt="Sound"
          width={48}
          height={48}
        />
      </div>
      <Link href='/stats'>
        <div className="rounded-lg p-2">
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
