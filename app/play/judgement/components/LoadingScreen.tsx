import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="text-white bg-collab-background relative h-screen bg-cover bg-center bg-no-repeat">
      <div className="flex items-center justify-center absolute -bottom-10">
        <Image src="/assets/loading/ghost.svg" alt="Ghost" width={551} height={551} />
      </div>
    </div>
  );
}
