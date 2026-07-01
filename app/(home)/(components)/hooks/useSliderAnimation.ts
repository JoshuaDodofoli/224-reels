import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer, SplitText } from "gsap/all";

gsap.registerPlugin(useGSAP, Observer, SplitText);

export const useSliderAnimation = (N: number, isComplete: boolean) => {
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
                type: "words, chars",
                wordsClass: "word",
                charsClass: "char",
            });
            gsap.set(split.words, { overflow: "hidden", verticalAlign: "top" });
            gsap.set(split.chars, { yPercent: 105 });

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
                        yPercent: direction > 0 ? 105 : -105,
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
                        yPercent: direction > 0 ? -105 : 105,
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
        { dependencies: [isComplete, N] }
    );

    // Direction-aware ticker
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
            "<0.04"
        );
    }, [activeIndex, isComplete]);

    return {
        activeIndex,
        displayIndex,
        outerRefs,
        innerRefs,
        textRefs,
        counterRef,
        dateRef
    };
};
