
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";
import { useIntro } from "../context/IntroContext";
import { useTransition } from "../../components/transition/TransitionContext";

interface IntroAnimeProps {
    sectionRef: RefObject<HTMLDivElement | null>;
}

export const useIntroAnime = ({ sectionRef }: IntroAnimeProps) => {
    const { setIsComplete } = useIntro();
    const { runIntroExit } = useTransition();

    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline();

        // 1. Initial state — everything hidden, characters offset and blurred
        tl.set(".stage-2", { opacity: 1 })
          .set(".stage-2 .char", { yPercent: 110, opacity: 0, filter: "blur(14px)" })
          .set(".stage-2 .accent-line", { scaleX: 0 })
          .set(".stage-2 .title-reels", { yPercent: 110, opacity: 0 });

        // 2. "224" — characters rise, unblur, with a tight stagger
        tl.to(".stage-2 .char", {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.09,
            ease: "expo.out",
        });

        // 3. Accent line draws in
        tl.to(".stage-2 .accent-line", {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.inOut",
        }, "-=0.55");

        // 4. REELS wipes up into its mask
        tl.to(".stage-2 .title-reels", {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
        }, "-=0.5");

        // 5. Hold, then fade the wordmark while the canvas takes over
        tl.to(".stage-2", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
        }, "+=1.4");

        // 6. Hand off to the page-transition canvas: it covers (matching grey-200),
        //    we unmount the intro section, then the canvas dissolves out.
        tl.call(() => {
            runIntroExit(() => {
                setIsComplete(true);
            });
        });

    }, { scope: sectionRef, dependencies: [] });
};
