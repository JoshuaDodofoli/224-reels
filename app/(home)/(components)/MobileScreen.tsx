'use client';
import { reelsData } from "@/app/utils/data";
import { useState, useRef } from "react";
import FloatingButton from "./FloatingButton";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MobileScreen = () => {
    const reelTitles = reelsData.map((reel) => reel.title);
    const [currentReel, setCurrentReel] = useState(0);
    const imgContainerRef = useRef<HTMLDivElement>(null);

    const next = () => {
        setCurrentReel((prev) => (prev + 1) % reelsData.length);
    }

    const prev = () => {
        setCurrentReel((prev) => (prev - 1 + reelsData.length) % reelsData.length);
    }

    const handleTitleClick = (index: number) => {
        setCurrentReel(index);
    }

    useGSAP(() => {
        if (!imgContainerRef.current) return;

        gsap.fromTo(imgContainerRef.current, {
            opacity: 0.3,
            scale: 1.02,
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.Out',
        }
        )
    }, [currentReel])

    return (
        <section className="w-full h-dvh">
            <div className="w-full h-full fixed inset-0">
                <div ref={imgContainerRef} className="relative w-full h-full">
                    <Image
                        src={reelsData[currentReel].img}
                        alt={reelsData[currentReel].title}
                        fill
                        className="object-cover object-center"
                    />
                </div>
            </div>

            <div className="absolute bottom-4 w-full flex items-center justify-center">
                <FloatingButton
                    next={next}
                    prev={prev}
                    reelTitle={reelTitles[currentReel]}
                    allTitles={reelTitles}
                    currentIndex={currentReel}
                    onTitleClick={handleTitleClick}
                />
            </div>
        </section>
    );
}

export default MobileScreen;