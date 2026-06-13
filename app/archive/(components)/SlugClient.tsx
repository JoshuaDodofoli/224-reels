'use client'

import Image from "next/image";
import { Reel } from "@/app/utils/data";
import Wrapper from "@/app/components/Wrapper";

interface SlugProps {
    reel: Reel;
}

const SlugClient = ({ reel }: SlugProps) => {
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


            <div className="sticky bottom-0 z-0 min-h-[60vh]">
                <Wrapper>
                    <h2 className="text-4xl text-white">THis is kinda like the footer</h2>
                </Wrapper>
            </div>
        </div>
    );
};

export default SlugClient;