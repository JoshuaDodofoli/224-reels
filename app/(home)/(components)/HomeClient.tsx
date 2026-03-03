'use client'
import { useRef, useState, useEffect } from "react";
import { VideoAsset } from "@/app/utils/types";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import MobileScreen from "./MobileScreen";
import classNames from "classnames";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Wrapper from "@/app/components/Wrapper";

export default function Home() {

  return (
    <section className="flex items-center justify-center h-screen w-full">
      <Wrapper >

        <div className="w-full h-full items-center justify-center flex">
          <div className="relative w-92 h-62 md:w-120 md:h-75  bg-black">
            <Image
              src="/images/img-7.webp"
              alt="image 1"
              fill
              className="object-center object-contain"
            />
          </div>
        </div>
      </Wrapper>
    </section>
  );
}