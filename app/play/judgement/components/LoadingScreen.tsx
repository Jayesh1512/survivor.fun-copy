import Image from 'next/image';
import collabBackground from '@/public/assets/game/collabBackground.webp';

export default function LoadingScreen() {
  return (
    <div className="text-white relative h-screen">
      <Image
        src={collabBackground}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10"
      />
      <div className="flex items-center justify-center absolute -bottom-10">
        <Image src="/assets/loading/ghost.svg" alt="Ghost" width={551} height={551} />
      </div>
    </div>
  );
}
