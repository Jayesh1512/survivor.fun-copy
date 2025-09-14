"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import characterBackground from '@/public/assets/mint/characterBg.webp';

const Loading: React.FC = () => {

    const images = [
        '/assets/characters/one.webp',
        '/assets/characters/two.webp',
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 200);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="relative min-h-screen">
            <Image
                src={characterBackground}
                alt="Character background"
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                className="object-cover -z-10"
            />
            <h1 className='pt-20 text-white text-2xl font-bold justify-center items-center flex'>
                Generating Bubba Agent
            </h1>
            <div className='w-full h-[302.19px] absolute bottom-0 flex justify-center items-center bg-center bg-cover'>
                <div
                    className="flex flex-col bg-center items-center justify-center w-[317px] h-[361.21px] absolute left-1/2 bottom-37 -translate-x-1/2"
                >

                    <Image
                        src={images[currentIndex]}
                        alt="Loading character"
                        width={288}
                        height={288}
                        className="w-[288px] h-[288px] rounded-[27%]"
                    />
                </div>
            </div>

        </div>
    );
};

export default Loading;
