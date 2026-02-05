'use client'
import { useEffect, useState } from "react";
import { VideoAsset } from "@/app/utils/types";
import BackgroundVideo from "next-video/background-video";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import FloatingButton from "./FloatingButton";

interface HomeClientProps {
  videos: VideoAsset[]
}

export default function Home({ videos }: HomeClientProps) {


  return (
    <section className="w-full h-dvh">
      <div className="w-full h-full fixed inset-0">
        {/* {reelsData.map((reel, idx) => {
          return ( */}
        <div className="relative w-full h-full">
          <Image
            src={reelsData[2].img}
            alt={reelsData[0].title}
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

      <div className="w-full h-full relative flex items-end justify-center pb-6 ">
        <div className="hidden lg:block">
          <ul className="text-background flex max-w-lg flex-wrap items-center justify-center w-full gap-0 md:gap-1">
            {reelsData.map((reel, idx) => {
              return (
                <div key={idx}>
                  <li className="flex gap-1 text-body md:text-xl hover:text-grey-300 duration-300 font-sans font-medium tracking-wide">
                    {reel.title}
                    <span className="mr-px font-medium">
                      {idx < reelsData.length - 1 && '/'}
                    </span>
                  </li>
                  <span className="w-full bg-background h-0.5"></span>
                </div>
              )
            })}
          </ul>
        </div>
        <div className="block lg:hidden">
          <FloatingButton />
        </div>
      </div>
    </section>
  );
}