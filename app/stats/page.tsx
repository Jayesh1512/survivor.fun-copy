import TopBar from './topBar';
import StatsArea from './statsArea';

export default function StatsPage() {
  return (
    <div className="min-h-screen w-[390px] h-[844px] bg-stats-page bg-[length:390px_844px] bg-no-repeat bg-center">
      <TopBar />
      <StatsArea totalgames={42} />
    </div>
  );
}
