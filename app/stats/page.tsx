import TopBar from './topBar';
import StatsArea from './statsArea';
import Image from 'next/image';
import statsBackground from '@/public/assets/stats/bg-stats.svg';

export default function StatsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <img
      src={statsBackground}
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
    />


      {/* Top bar */}
      <TopBar />

      {/* Stats content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <StatsArea />
      </div>
    </div>
  );
}
