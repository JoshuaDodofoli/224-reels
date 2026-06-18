
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
          .set(".stage-1 .logo-symbol", { opacity: 0, scale: 0.9 })
          .set(".stage-1 .tagline", { opacity: 0, y: 15 })
          .set(".stage-2", { opacity: 0 })
          .set(".stage-2 .title-224", { opacity: 0, y: 30 })
          .set(".stage-2 .title-reels", { opacity: 0, letterSpacing: "0.6em" })
          .set(".stage-2 .stage-2-dot", { opacity: 0, scale: 0 })
          .set(".stage-2 .stage-2-meta", { opacity: 0, y: 10 });

        // 2. Stage 1 Reveal (Symbol & Tagline)
        tl.to(".stage-1 .logo-symbol", {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
        })
        .to(".stage-1 .tagline", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")

        // 3. Stage 1 Fade Out
        .to(".stage-1", {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power3.inOut"
        }, "+=1.2") // Hold for 1.2s before fading out

        // 4. Stage 2 Reveal (Main Branding)
        .set(".stage-2", { opacity: 1 }) // Make container active
        .to(".stage-2 .title-224", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        })
        .to(".stage-2 .title-reels", {
            opacity: 1,
            letterSpacing: "1.2em",
            duration: 1.2,
            ease: "power3.out"
        }, "-=1.0")
        .to(".stage-2 .stage-2-dot", {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(2)"
        }, "-=0.8")
        .to(".stage-2 .stage-2-meta", {
            opacity: 0.6,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.6")

        // 5. Exit Curtain Transition (Slide up revealing the site)
        .to(sectionRef.current, {
            yPercent: -100,
            duration: 1.4,
            ease: "power4.inOut"
        }, "+=1.8"); // Hold main logo for 1.8s

    }, { scope: sectionRef, dependencies: [] });
};