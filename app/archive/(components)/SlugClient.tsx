'use client'

import Image from "next/image";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { Reel, reelsData } from "@/app/utils/data";
import Wrapper from "@/app/components/Wrapper";
import { useEffect, useRef } from "react";
import { useScrollToNext } from "@/app/utils/hooks/useScrollToNext";

interface SlugProps {
    reel: Reel;
}

const SlugClient = ({ reel }: SlugProps) => {
    const currentIndex = reelsData.findIndex((r) => r.slug === reel.slug);
    const nextReel = reelsData[(currentIndex + 1) % reelsData.length];

    const leftBarRef = useRef<HTMLDivElement>(null);
    const rightBarRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);

    useScrollToNext(`/archive/${nextReel.slug}`, {
        onProgress: (p) => {
            const t = `scaleX(${p})`;
            if (leftBarRef.current) leftBarRef.current.style.transform = t;
            if (rightBarRef.current) rightBarRef.current.style.transform = t;
            if (mobileBarRef.current) mobileBarRef.current.style.transform = t;
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [reel.slug]);

    return (
        <div className="bg-grey-700">

            <div className="relative z-10 min-h-screen bg-grey-200">

                <Wrapper noPadding>
                    <div className="relative w-full h-screen">
                        <Image
                            src={reel.img}
                            alt={reel.title}
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        {/* Back button */}
                        <div className="absolute top-4 right-4 z-10">
                            <TransitionLink
                                href="/"
                                className="group inline-flex items-center bg-grey-700 text-white px-2 h-6 overflow-hidden"
                            >
                                <div className="flex flex-col transition-transform duration-500 ease-in-out">
                                    <span className="text-sm h-6 font-sans flex items-center">Close</span>
                                </div>
                            </TransitionLink>
                        </div>
                    </div>
                </Wrapper>

                <Wrapper>
                    <div className="py-24 min-h-[60vh] flex flex-col gap-12 max-w-5xl mx-auto">

                        <div className="flex items-center justify-between">
                            <span className="font-sans text-grey-400 text-xs uppercase tracking-wide">
                                {reel.type}
                            </span>
                            <span className="font-sans text-grey-400 text-xs uppercase tracking-wide">
                                {reel.date}
                            </span>
                        </div>

                        <hr className="border-grey-400" />

                        <div className="grid md:grid-cols-2 gap-10 items-start">
                            <h1 className="text-h2 lg:text-h1 font-sans leading-none tracking-tight">
                                {reel.title}
                            </h1>
                            <p className="text-grey-450 text-body font-sans leading-relaxed">
                                {reel.desc}
                            </p>
                        </div>

                    </div>
                </Wrapper>
            </div>

            {/* footer */}

            <div className="sticky bottom-0 z-0 h-[80vh] flex flex-col justify-end">
                <TransitionLink href={`/archive/${nextReel.slug}`} className="group block w-full">
                    <div className="relative w-full h-[80vh] overflow-hidden">
                        <Image
                            src={nextReel.img}
                            alt={nextReel.title}
                            fill
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-grey-700/50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                            <span className="font-sans text-grey-200 text-xs uppercase tracking-widest">
                                {/* Next — {nextReel.type} */}
                                Next
                            </span>
                            {/* desktop: bars flank the title */}
                            <div className="hidden md:flex items-center gap-6 py-12">
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={leftBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{ transform: "scaleX(0)", transformOrigin: "right" }}
                                    />
                                </div>
                                <h2 className="text-h1 font-sans text-grey-200 leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-70">
                                    {nextReel.title}
                                </h2>
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={rightBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
                                    />
                                </div>
                            </div>

                            {/* mobile: single bar below the title */}
                            <div className="flex md:hidden flex-col items-center gap-16 py-6">
                                <h2 className="text-h1 font-sans text-grey-200 leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-70">
                                    {nextReel.title}
                                </h2>
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={mobileBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{ transform: "scaleX(0)", transformOrigin: "center" }}
                                    />
                                </div>
                            </div>

                            <span className="text-caption font-sans text-grey-200 uppercase tracking-widest">
                                keep scrolling
                            </span>
                        </div>
                    </div>
                </TransitionLink>
            </div>

        </div>
    );
};

export default SlugClient;

