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

export default function Home() {

  const [currentReel, setCurrentReel] = useState(0);
  const numbersRef = useRef(null);
  // const reelsData = reelsData.slice(4, 7);
  const nextId = (currentReel + 1) % reelsData.length;
  const previousId = (currentReel - 1 + reelsData.length) % reelsData.length;

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
        <div className="absolute left-0 bottom-7 flex items-center justify-center w-full z-20">
          <div  className="space-x-5">
            <span className="text-caption font-medium font-sans text-background/70">{previousId}</span>
            <ButtonBorder className="inline-block">
              <span className="text-body font-medium font-sans px-4 py-2 ">{reelsData[currentReel].id}</span>
            </ButtonBorder>
            <span className="text-caption font-medium font-sans text-background/70">{nextId}</span>
          </div>
        </div>

      </section>

      <section className="w-full min-h-screen text-background bg-black">
        <Wrapper className="space-y-12 py-32">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates laboriosam nisi accusantium nihil aspernatur tenetur perspiciatis assumenda, doloremque ad placeat harum sunt quam excepturi aperiam sed voluptas, facere quas, blanditiis eveniet debitis hic odit dolores fuga molestiae. Rem repudiandae non exercitationem consequatur praesentium impedit illo placeat, enim minima aperiam delectus beatae vel odit nostrum facilis quidem libero aut, dolorum aliquam.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates laboriosam nisi accusantium nihil aspernatur tenetur perspiciatis assumenda, doloremque ad placeat harum sunt quam excepturi aperiam sed voluptas, facere quas, blanditiis eveniet debitis hic odit dolores fuga molestiae. Rem repudiandae non exercitationem consequatur praesentium impedit illo placeat, enim minima aperiam delectus beatae vel odit nostrum facilis quidem libero aut, dolorum aliquam.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates laboriosam nisi accusantium nihil aspernatur tenetur perspiciatis assumenda, doloremque ad placeat harum sunt quam excepturi aperiam sed voluptas, facere quas, blanditiis eveniet debitis hic odit dolores fuga molestiae. Rem repudiandae non exercitationem consequatur praesentium impedit illo placeat, enim minima aperiam delectus beatae vel odit nostrum facilis quidem libero aut, dolorum aliquam.</p>
        </Wrapper>
      </section>

    </div>
  );
}