"use client";

import { Reel } from "@/app/utils/data";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { useIntro } from "@/app/utils/context/IntroContext";

gsap.registerPlugin(useGSAP, Observer, SplitText);

interface SliderViewProps {
    reels: Reel[];
}

export default function SliderView({ reels }: SliderViewProps) {
    const { isComplete } = useIntro();
    const N = reels.length;

    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    const isAnimating = useRef(false);
    const directionRef = useRef<number>(1);

    const counterRef = useRef<HTMLSpanElement>(null);
    const dateRef = useRef<HTMLSpanElement>(null);
    const [displayIndex, setDisplayIndex] = useState(0);

    const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(
        () => {
            if (!isComplete) return;

            outerRefs.current.forEach((el) => {
                if (!el) return;
                gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)", zIndex: 0 });
            });
            innerRefs.current.forEach((el) => {
                if (!el) return;
                gsap.set(el, { scale: 1.15 });
            });

            const allTexts = textRefs.current.filter(Boolean);
            const split = new SplitText(allTexts, {
                type: "chars",
                charsClass: "char",
            });
            gsap.set(split.chars, { yPercent: 100 });

            const firstOuter = outerRefs.current[0];
            const firstInner = innerRefs.current[0];
            const firstChars = textRefs.current[0]?.querySelectorAll(".char");
            gsap.set(firstOuter, { zIndex: 1 });

            const intro = gsap.timeline({ defaults: { ease: "power4.inOut" } });
            intro.to(firstOuter, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.1,
            });
            intro.to(firstInner, { scale: 1, duration: 1.1 }, "<");
            if (firstChars?.length) {
                intro.to(
                    firstChars,
                    {
                        yPercent: 0,
                        duration: 1.3,
                        ease: "expo.inOut",
                        stagger: 0.01,
                    },
                    "-=0.55",
                );
            }

            const handleScroll = (direction: number) => {
                if (isAnimating.current) return;
                isAnimating.current = true;
                directionRef.current = direction;

                const prevIdx = activeIndexRef.current;
                const nextIdx = (prevIdx + direction + N) % N;
                activeIndexRef.current = nextIdx;
                setActiveIndex(nextIdx);

                const prevOuter = outerRefs.current[prevIdx];
                const nextOuter = outerRefs.current[nextIdx];
                const nextInner = innerRefs.current[nextIdx];
                const prevChars =
                    textRefs.current[prevIdx]?.querySelectorAll(".char");
                const nextChars =
                    textRefs.current[nextIdx]?.querySelectorAll(".char");

                const enterFrom =
                    direction > 0
                        ? "inset(100% 0% 0% 0%)"
                        : "inset(0% 0% 100% 0%)";
                const exitTo =
                    direction > 0
                        ? "inset(0% 0% 100% 0%)"
                        : "inset(100% 0% 0% 0%)";

                gsap.set(nextOuter, { clipPath: enterFrom, zIndex: 2 });
                gsap.set(nextInner, { scale: 1.1 });
                if (nextChars?.length) {
                    gsap.set(nextChars, {
                        yPercent: direction > 0 ? 100 : -100,
                    });
                }

                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(prevOuter, {
                            clipPath: "inset(100% 0% 0% 0%)",
                            zIndex: 0,
                        });
                        gsap.set(nextOuter, { zIndex: 1 });
                        isAnimating.current = false;
                    },
                });

                if (prevChars?.length) {
                    tl.to(prevChars, {
                        yPercent: direction > 0 ? -100 : 100,
                        duration: 0.35,
                        ease: "power2.in",
                        stagger: 0.008,
                    });
                }

                tl.to(
                    prevOuter,
                    {
                        clipPath: exitTo,
                        duration: 0.85,
                        ease: "power4.inOut",
                    },
                    prevChars?.length ? "-=0.15" : 0,
                );

                tl.to(
                    nextOuter,
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 0.85,
                        ease: "power4.inOut",
                    },
                    "<",
                );

                tl.to(
                    nextInner,
                    {
                        scale: 1,
                        duration: 0.85,
                        ease: "power4.inOut",
                    },
                    "<",
                );

                if (nextChars?.length) {
                    tl.to(
                        nextChars,
                        {
                            yPercent: 0,
                            duration: 1.1,
                            ease: "expo.inOut",
                            stagger: 0.01,
                        },
                        "-=0.45",
                    );
                }
            };

            const obs = Observer.create({
                target: window,
                type: "wheel,touch",
                preventDefault: true,
                tolerance: 40,
                onUp: () => handleScroll(1),
                onDown: () => handleScroll(-1),
                onLeft: () => handleScroll(-1),
                onRight: () => handleScroll(1),
            });

            return () => {
                obs.kill();
                split.revert();
            };
        },
        { dependencies: [isComplete] },
    );

    // ── Direction-aware ticker ────────────────────────────────────────
    useEffect(() => {
        if (!counterRef.current || !dateRef.current || !isComplete) return;

        const dir = directionRef.current;
        const exitY = dir > 0 ? "-120%" : "120%";
        const enterY = dir > 0 ? "120%" : "-120%";

        const tl = gsap.timeline();
        tl.to([counterRef.current, dateRef.current], {
            y: exitY,
            duration: 0.2,
            ease: "power2.in",
            stagger: 0.025,
        });
        tl.call(() => setDisplayIndex(activeIndex));
        tl.set([counterRef.current, dateRef.current], { y: enterY });
        tl.to(counterRef.current, {
            y: "0%",
            duration: 0.45,
            ease: "power3.out",
        });
        tl.to(
            dateRef.current,
            { y: "0%", duration: 0.45, ease: "power3.out" },
            "<0.04",
        );
    }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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
                                                // Hide all player chrome
                                                ["--controls" as string]:
                                                    "none",
                                                // Make video fill + cover like next/image fill
                                                ["--media-object-fit" as string]:
                                                    "cover",
                                                ["--media-object-position" as string]:
                                                    "center",
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
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div
                                            ref={(el) => {
                                                textRefs.current[idx] = el;
                                            }}
                                            className="reel-text text-h3 md:text-h2 font-semibold uppercase font-sans text-grey-200 text-center overflow-hidden"
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
