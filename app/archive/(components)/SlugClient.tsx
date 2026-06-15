'use client'

import Image from "next/image";
import Link from "next/link";
import { Reel, reelsData } from "@/app/utils/data";
import Wrapper from "@/app/components/Wrapper";
import { useEffect } from "react";

interface SlugProps {
    reel: Reel;
}

const SlugClient = ({ reel }: SlugProps) => {
    const currentIndex = reelsData.findIndex((r) => r.slug === reel.slug);
    const nextReel = reelsData[(currentIndex + 1) % reelsData.length];

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
                            <Link
                                href="/"
                                className="group inline-flex items-center bg-grey-700 text-white px-2 h-6 overflow-hidden"
                            >
                                <div className="flex flex-col transition-transform duration-500 ease-in-out">
                                    <span className="text-sm h-6 font-sans flex items-center">Close</span>
                                </div>
                            </Link>
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
                            <h1 className="text-h1 font-sans leading-none tracking-tight">
                                {reel.title}
                            </h1>
                            <p className="text-grey-400 text-sm font-sans leading-relaxed">
                                {reel.desc}
                            </p>
                        </div>

                    </div>
                </Wrapper>
            </div>

            <div className="sticky bottom-0 z-0 h-[80vh] flex flex-col justify-end">
                <Link href={`/archive/${nextReel.slug}`} className="group block w-full">
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
                                Next — {nextReel.type}
                            </span>
                            <h2 className="text-h1 font-sans text-white leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-70">
                                {nextReel.title}
                            </h2>
                        </div>
                    </div>
                </Link>
            </div>

        </div>
    );
};

export default SlugClient;

