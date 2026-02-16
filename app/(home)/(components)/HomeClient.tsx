'use client'
import { useRef, useState, useEffect } from "react";
import { VideoAsset } from "@/app/utils/types";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import classNames from "classnames";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Wrapper from "@/app/components/Wrapper";
import ButtonBorder from "@/app/components/ButtonBorder";
import Link from "next/link";

export default function Home() {

  const [currentReel, setCurrentReel] = useState(0);
  const numbersRef = useRef(null);
  // const reelsData = reelsData.slice(4, 7);
  const nextId = (currentReel + 1) % reelsData.length;
  const previousId = (currentReel - 1 + reelsData.length) % reelsData.length;


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReel((prev) => (prev + 1) % reelsData.length);
    }, 2000);

    return () => clearInterval(interval);

  }, [currentReel]);

  return (
    <div className="w-full min-h-screen">
      <section className="w-full h-screen sticky top-0 left-0 -z-10">
        <div className="relative w-full h-full">
          <Image src={reelsData[currentReel].img} alt={reelsData[currentReel].title} fill className="object-cover" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center w-full z-20">
          <div className="">
            <span className="text-h3 font-semibold font-sans">{reelsData[currentReel].title}</span>
          </div>
        </div>
        {/* <div className="absolute left-0 bottom-7 flex items-center justify-center w-full z-20">
          <div  className="space-x-5">
            <span className="text-caption font-medium font-sans text-background/70">{previousId}</span>
            <ButtonBorder className="inline-block">
              <span className="text-body font-medium font-sans px-4 py-2 ">{reelsData[currentReel].id}</span>
            </ButtonBorder>
            <span className="text-caption font-medium font-sans text-background/70">{nextId}</span>
          </div>
        </div> */}

      </section>

      <section className="w-full relative text-background bg-black">
        <div className="relative w-full h-screen">
          <Image
            fill
            src={reelsData[5].img}
            alt={reelsData[6].title}
            className="object-cover object-center"
          />
        </div>
        <div className="w-full h-full bg-black/20 inset-0 absolute" />
        <div className="absolute top-1/2 left-1/2 text-center max-w-xs md:max-w-md w-full -translate-x-1/2 -translate-y-1/2 z-30">
          <p className="text-h3 md:text-h2 leading-[1.1] font-sans font-medium">I observe and just take the shot if I like it.</p>
          <button className="pt-5 md:pt-8 cursor-pointer">
            <Link href="/shots">
              <ButtonBorder><span className="px-4 font-sans">Wanna see some shots?</span></ButtonBorder>
            </Link>
          </button>
        </div>
      </section>

    </div>
  );
}