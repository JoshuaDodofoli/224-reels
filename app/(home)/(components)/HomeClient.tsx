'use client'
import { useRef, useState, useEffect } from "react";
import { VideoAsset } from "@/app/utils/types";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import MobileScreen from "./MobileScreen";
import classNames from "classnames";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const [currentReel, setCurrentReel] = useState(0);
  const [hoveredReel, setHoveredReel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const imgContainer = useRef<HTMLDivElement>(null);

  const slicedReels = reelsData.slice(3, 8);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = slicedReels.length;

    const imagePromises = slicedReels.map((reel) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = reel.img;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(true);
        };
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setTimeout(() => setIsLoading(false), 300); // Small delay for smooth transition
      })
      .catch((err) => {
        console.error('Error preloading images:', err);
        setIsLoading(false); // Still show content even if some images fail
      });
  }, []);

  const handleHover = (idx: number) => {
    setHoveredReel(idx);
  }

  const handleMouseLeave = () => {
    setHoveredReel(null);
  }

  const handleClick = (idx: number) => {
    setCurrentReel(idx);
    setHoveredReel(null);
  }

  const displayedReel = hoveredReel !== null ? hoveredReel : currentReel;

  useGSAP(() => {
    if (!imgContainer.current || isLoading) return;

    gsap.fromTo(imgContainer.current, {
      opacity: 0.3,
      scale: 1.01,
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [displayedReel, isLoading])

  // Loading screen
  if (isLoading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-2xl font-medium mb-4">Loading</div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-gray-400 text-sm mt-2">{loadingProgress}%</div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full h-dvh">
      <div className=" h-full hidden lg:block">
        <div className="w-full h-full fixed inset-0">
          <div ref={imgContainer} className="relative w-full h-full">
            <Image
              src={slicedReels[displayedReel].img}
              alt={slicedReels[displayedReel].title}
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        <div className="w-full h-full relative flex items-end justify-center pb-6">
          <div className="hidden lg:block">
            <ul className="text-background flex max-w-lg flex-wrap items-center justify-center w-full gap-0 md:gap-1">
              {slicedReels.map((reel, idx) => {
                return (
                  <li key={idx} className="flex gap-1 items-center">
                    <span
                      onMouseEnter={() => handleHover(idx)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(idx)}
                      className={classNames(
                        'cursor-pointer text-body md:text-xl hover:text-grey-400 duration-300 font-sans font-medium tracking-wide',
                        currentReel === idx && 'text-grey-400'
                      )}
                    >
                      {reel.title}
                    </span>
                    {idx < slicedReels.length - 1 && (
                      <span className="font-medium text-body md:text-xl">
                        /
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="block lg:hidden h-full">
        <MobileScreen />
      </div>
    </section>
  );
}