'use client'
import { useRef, useState } from "react";
import { VideoAsset } from "@/app/utils/types";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import MobileScreen from "./MobileScreen";
import classNames from "classnames";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// interface HomeClientProps {
//   videos: VideoAsset[]
// }

export default function Home() {


  const [currentReel, setCurrentReel] = useState(0);
  const [hoveredReel, setHoveredReel] = useState<number | null>(null);
  const imgContainer = useRef<HTMLDivElement>(null);

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

    gsap.fromTo(imgContainer.current, {
      opacity: 0.3,
      scale: 1.01,
    }, {
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
          {/* {reelsData.map((reel, idx) => {
          return ( */}
          <div ref={imgContainer} className="relative w-full h-full">
            <Image
              src={reelsData[displayedReel].img}
              alt={reelsData[displayedReel].title}
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

        <div className="w-full h-full relative flex items-end justify-center pb-6">
          <div className="hidden lg:block">
            <ul className="text-background flex max-w-lg flex-wrap items-center justify-center w-full gap-0 md:gap-1">
              {reelsData.map((reel, idx) => {
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
                    {idx < reelsData.length - 1 && (
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