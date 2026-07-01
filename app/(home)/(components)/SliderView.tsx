"use client";

import { Reel } from "@/app/utils/data";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { useIntro } from "@/app/utils/context/IntroContext";
import { useSliderAnimation } from "./hooks/useSliderAnimation";

interface SliderViewProps {
    reels: Reel[];
}

export default function SliderView({ reels }: SliderViewProps) {
    const { isComplete } = useIntro();
    const N = reels.length;

    const {
        activeIndex,
        displayIndex,
        outerRefs,
        innerRefs,
        textRefs,
        counterRef,
        dateRef
    } = useSliderAnimation(N, isComplete);

    return (
        <section className="w-full h-dvh flex justify-center items-center px-4 md:px-0">
            <div className="w-full md:w-1/2">
                {/* Slide stack */}
                <div className="relative aspect-video overflow-hidden">
                    {reels.map((reel, idx) => (
                        <TransitionLink
                            key={reel.slug}
                            href={`/archive/${reel.slug}`}
                            className={`absolute inset-0 ${idx === activeIndex ? "pointer-events-auto" : "pointer-events-none"}`}
                        >
                            <div
                                ref={(el) => {
                                    outerRefs.current[idx] = el;
                                }}
                                className="absolute inset-0"
                                style={{ clipPath: "inset(100% 0% 0% 0%)" }}
                            >
                                <div
                                    ref={(el) => {
                                        innerRefs.current[idx] = el;
                                    }}
                                    className="relative w-full h-full"
                                >
                                    {reel.video ? (
                                        <MuxPlayer
                                            playbackId={reel.video}
                                            streamType="on-demand"
                                            autoPlay
                                            muted
                                            playsInline
                                            loop
                                            paused={idx !== activeIndex}
                                            className="absolute inset-0 w-full h-full"
                                            style={{
                                                ["--controls" as string]: "none",
                                                ["--media-object-fit" as string]: "cover",
                                                ["--media-object-position" as string]: "center",
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={reel.img}
                                            alt={reel.desc}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-center object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                                        <div
                                            ref={(el) => {
                                                textRefs.current[idx] = el;
                                            }}
                                            className="reel-text text-h3 leading-tight md:text-h2 font-semibold uppercase font-sans text-grey-200 text-center overflow-hidden max-w-[70%] md:max-w-[50%]"
                                        >
                                            {reel.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionLink>
                    ))}
                </div>

                {/* Ticker row */}
                <div className="flex items-center justify-between w-full pt-4 pb-1">
                    <div className="flex items-baseline gap-1 font-sans text-xs">
                        <div className="overflow-hidden leading-none">
                            <span ref={counterRef} className="inline-block">
                                0{displayIndex + 1}
                            </span>
                        </div>
                        <span className="text-grey-400">/</span>
                        <span className="text-grey-400">0{N}</span>
                    </div>
                    <div className="overflow-hidden leading-none">
                        <span
                            ref={dateRef}
                            className="font-sans text-xs text-grey-400 inline-block"
                        >
                            {reels[displayIndex]?.date}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
