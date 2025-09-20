import TopBar from './topBar';
import StatsArea from './statsArea';
import Image from 'next/image';
import statsBackground from '@/public/assets/stats/bg-stats.svg';

export default function StatsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={statsBackground}
          alt="Background"
          fill
          priority
          className="object-cover pointer-events-none"
          sizes="100vw"
        />
      </div>

      {/* Top bar */}
      <TopBar />

      {/* Stats content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen">
        <StatsArea />
      </div>
    </div>
  );
}
