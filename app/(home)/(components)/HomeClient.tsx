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
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {

  const [currentReel, setCurrentReel] = useState(0);
  const numbersRef = useRef(null);
  const imgRef1 = useRef(null);
  const imgContainer1 = useRef(null);
  const pRef1 = useRef(null);
  const btn1 = useRef(null);
  // const reelsData = reelsData.slice(4, 7);
  const nextId = (currentReel + 1) % reelsData.length;
  const previousId = (currentReel - 1 + reelsData.length) % reelsData.length;


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReel((prev) => (prev + 1) % reelsData.length);
    }, 2000);

    return () => clearInterval(interval);

  }, [currentReel]);

    useGSAP(() => {
        if (!imgContainer1.current && !imgRef1.current) return;
        if (!pRef1.current) return;
        if (!btn1.current) return;
        
        gsap.set(imgRef1.current, {
            yPercent: -10
        })

        gsap.to(imgRef1.current, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: imgContainer1.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
        })

        const splitText1 = new SplitText(pRef1.current, { type: "lines", mask: "lines" });

        gsap.set(splitText1.lines, {
          yPercent: 100
        })

        gsap.set(btn1.current, {
          y: 50,
          opacity: 0
        })

        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: pRef1.current,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 1,
            markers: true
          }
        })

        tl1.to(splitText1.lines, {
          yPercent:0,
          stagger: 0.05,
          ease: 'power2.out',
        })
        .to(btn1.current, {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
        }, '-=0.2')

    }, [])

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
         <div ref={imgContainer1} className="relative w-full h-screen overflow-hidden">
          <div  ref={imgRef1} className="w-full h-[120%] relative">
            <Image
              fill
              src={reelsData[5].img}
              alt={reelsData[5].title}
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="w-full h-full bg-black/20 inset-0 absolute" />
        <div className="absolute top-1/2 left-1/2 text-center max-w-xs md:max-w-md w-full -translate-x-1/2 -translate-y-1/2 z-30">
          <p ref={pRef1} className="text-h3 md:text-h2 leading-[1.1] font-sans font-medium">I observe and just take the shot if I like it.</p>
          <button ref={btn1} className="pt-5 md:pt-8 cursor-pointer">
            <Link href="/shots">
              <ButtonBorder><span className="px-4 font-sans">Wanna see some shots?</span></ButtonBorder>
            </Link>
          </button>
        </div>
      </section>

      <section className="w-full relative text-background bg-black">
        <div className="relative w-full h-screen overflow-hidden">
          <div className="w-full h-[120%] relative">
            <Image
              fill
              src={reelsData[4].img}
              alt={reelsData[4].title}
              
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="w-full h-full bg-black/20 inset-0 absolute" />
        <div className="absolute top-1/2 left-1/2 text-center max-w-xs md:max-w-md w-full -translate-x-1/2 -translate-y-1/2 z-30">
          <p className="text-h3 md:text-h2 leading-[1.1] font-sans font-medium">A little something about this space.</p>
          <button className="pt-5 md:pt-8 cursor-pointer">
            <Link href="/shots">
              <ButtonBorder><span className="px-4 font-sans">Read if you're</span></ButtonBorder>
            </Link>
          </button>
        </div>
      </section>

    </div>
  );
}