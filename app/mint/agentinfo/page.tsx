import TopBar from './topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';
import mintInfoBg from '@/public/assets/mint/info-bg.png';

export default function AgentInfoPage() {
  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <Image
        src={mintInfoBg}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover z-0 pointer-events-none"
      />

      {/* Top bar */}
      <div className="relative z-50">
        <TopBar />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 flex flex-col justify-end overflow-y-auto relative z-10">
        {/* Character Image - responsive sizing based on viewport height */}
        <div className="flex items-end justify-center px-4">
          <div className="relative w-auto h-[30vh] sm:h-[35vh] md:h-[40vh] max-h-[364px]">
            <Image
              src="/assets/characters/one.webp"
              alt="agent"
              width={390}
              height={364}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Agent Stats */}
        <div className="flex-shrink-0">
          <AgentStats />
        </div>
      </div>
    </div>
  );
}
