
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";
import { useIntro } from "../context/IntroContext";

interface IntroAnimeProps {
    sectionRef: RefObject<HTMLDivElement | null>;
}

export const useIntroAnime = ({ sectionRef }: IntroAnimeProps) => {
    const { setIsComplete } = useIntro();

    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setIsComplete(true);
            }
        });

        // 1. Initial State Setup
        tl.set(sectionRef.current, { yPercent: 0 })
          .set(".stage-2", { opacity: 0 })
          .set(".stage-2 .title-224 span", { opacity: 0, y: 40 })
          .set(".stage-2 .title-reels", { opacity: 0 });

        // 2. Main Branding Reveal
        tl.set(".stage-2", { opacity: 1 }) // Make container active
        .to(".stage-2 .title-224 span", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power4.out"
        })
        .to(".stage-2 .title-reels", {
            opacity: 1,
            duration: 1.1,
            ease: "power3.out"
        }, "-=0.6")

        // 3. Exit Curtain Transition (Slide up revealing the site)
        .to(sectionRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut"
        }, "+=1.5"); // Hold main logo for 1.5s

    }, { scope: sectionRef, dependencies: [] });
};
