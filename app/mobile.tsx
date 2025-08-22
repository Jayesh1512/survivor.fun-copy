import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Mobile: React.FC = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-survivor-pattern bg-cover bg-center bg-no-repeat">
            <Image
                src="/assets/logo.webp"
                alt="Survivor.fun Logo"
                width={322}
                height={124}
                className="mx-auto pt-10"
            />
            <div className="flex items-center justify-center">
                <div className="flex flex-row items-center w-[358px] justify-between absolute bottom-34">
                    <Image
                        src="/assets/sound.webp"
                        alt="Volume Image"
                        width={48}
                        height={48}
                    />
                    {/* <div className="w-[144px] h-[48px] bg-address-display rounded-[12px] text-white">
                        0x000...0000
                    </div> */}
                </div>
            </div>
            <div className="flex items-center justify-center">
                <Button onClick={() => router.push('/mint')} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                    Start Game
                </Button>
            </div>
        </div>
    );
};

export default Mobile;
