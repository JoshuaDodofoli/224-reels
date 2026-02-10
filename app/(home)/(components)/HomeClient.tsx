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
  const imgContainer = useRef<HTMLDivElement>(null);

  const slicedReels = reelsData.slice(3, 8);

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
    if (!imgContainer.current) return;

    gsap.set(imgContainer.current, {
      opacity: 0.3,
      scale: 1.01,
    })

    gsap.to(imgContainer.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [displayedReel])

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
                        'cursor-pointer text-body md:text-xl hover:text-grey-400 duration-300 font-sans  tracking-wide',
                        currentReel === idx && 'text-grey-200/70'
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