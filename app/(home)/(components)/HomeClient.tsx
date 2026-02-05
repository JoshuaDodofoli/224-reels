'use client'
import { useEffect, useState } from "react";
import { VideoAsset } from "@/app/utils/types";
import BackgroundVideo from "next-video/background-video";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";

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
                src={reelsData[3].img}
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

      <div className="">
        <ul>
          {reelsData.map((reel, idx) => {
            return (
              <li key={idx}>
                {reel.title}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  );
}