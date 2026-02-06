'use client'

import { reelsData } from "@/app/utils/data";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FloatingButton from "./FloatingButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MobileScreen = () => {

    const reelTitle = reelsData.map((reel) => (reel.title));

    const [currentReel, setCurrentReel] = useState(0);
    const imgRef = useRef<HTMLImageElement>(null);

    const next = () => {
        setCurrentReel((prev) => (prev + 1) % reelsData.length);
    }

    const prev = () => {
        setCurrentReel((prev) => (prev - 1) % reelsData.length);
    }

    useGSAP(() => {
        if (!imgRef.current) return;

        gsap.fromTo(imgRef.current, {
            opacity: 0.2,
            scale: 1.03,
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.Out',
        })

    }, [currentReel])

    return (
        <section className="w-full h-dvh">
            <div className="w-full h-full fixed inset-0">
                {/* {reelsData.map((reel, idx) => {
          return ( */}
                    
                <div ref={imgRef} className="relative w-full h-full">
                    <Image
                        src={reelsData[currentReel].img}
                        alt={reelsData[currentReel].title}
                        fill
                        className="object-cover object-center"
                    />
                </div>
                {/* )
        })} */}
                {/* {reelsData.map((reel, idx) => {
          return (
            <div key={idx} className="relative w-full h-full">
              <Image
                src={reel.img}
                alt={reel.title}
                fill
                className="object-cover object-center"
              />
            </div>
          )
        })} */}
            </div>

            <div className="absolute bottom-6 w-full flex items-center justify-center">
                <FloatingButton
                    next={next}
                    prev={prev}
                    reelTitle={reelTitle[currentReel]} />
            </div>
        </section>
    );
}

export default MobileScreen