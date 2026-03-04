'use client'
import { useRef, useState, useEffect } from "react";
import { VideoAsset } from "@/app/utils/types";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import MobileScreen from "./MobileScreen";
import classNames from "classnames";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Wrapper from "@/app/components/Wrapper";

export default function Home() {

  const slicedReels = reelsData.slice(0, 3);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useGSAP(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, {
        yPercent: i * -10,
        scale: 1 - i * 0.05,
        zIndex: slicedReels.length - i,
        transformOrigin: "center center",
        transformPerspective: 800,
        rotationX: i * 2,
      });
    });
  }, []);

  return (
    <section className="flex items-center justify-center h-screen w-full">
      <Wrapper>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="w-92 lg:w-120 xl:w-xl mx-auto" style={{ aspectRatio: "16/9", position: "relative" }}>
            {slicedReels.map((reel, i) => (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={reel.img}
                    alt="image 1"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
          <span className="text-sm font-sans font-medium">Video title 1</span>
        </div>
      </Wrapper>
    </section>
  );
}