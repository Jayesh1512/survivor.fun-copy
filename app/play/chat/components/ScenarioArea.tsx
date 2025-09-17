interface ScenarioAreaProps {
  scenario: string;
}

export default function ScenarioArea({ scenario }: ScenarioAreaProps) {
  return (
    <>
      <div className="bg-black/30 px-4 py-3 ">
        <div className="text-center text-white text-lg">
          {scenario}
        </div>
      </div>
      {/* Separator Line */}
      <div className="h-px bg-white opacity-30"></div>
    </>
  );
}
