"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const Character: React.FC = () => {

    const characters = [
        {
            name: "Baby Rebel",
            image: "/assets/characters/one.svg",
        },
        {
            name: "Baby Punk",
            image: "/assets/characters/two.svg",
        },
    ]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(event.touches[0].clientX);
        setTouchEndX(null);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        setTouchEndX(event.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) {
            return;
        }
        const deltaX = touchEndX - touchStartX;
        const swipeThreshold = 50; // pixels

        if (deltaX > swipeThreshold) {
            // swipe right → previous character
            setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
        } else if (deltaX < -swipeThreshold) {
            // swipe left → next character
            setCurrentIndex((prev) => (prev + 1) % characters.length);
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    return (
        <div className="min-h-screen bg-character-background bg-cover bg-center bg-no-repeat">

            <div className='bg-bottom-frame w-full h-[302.19px] absolute bottom-0 flex justify-center items-center bg-center bg-cover'>
                <div
                    className="flex flex-col bg-character-frame items-center justify-center w-[317px] h-[361.21px] absolute left-1/2 bottom-37 -translate-x-1/2"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <h1 className='text-white text-2xl font-bold'>
                        {characters[currentIndex].name}
                    </h1>
                    <Image
                        src={characters[currentIndex].image}
                        alt={characters[currentIndex].name}
                        width={288}
                        height={288}
                        className="w-[288px] h-[288px] rounded-[27%]"
                    />
                </div>
            </div>

        </div>
    );
};

export default Character;
