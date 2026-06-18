'use client'

import { useRef } from "react";
import { useIntroAnime } from "../utils/hooks/useIntroAnime";
import { useIntro } from "../utils/context/IntroContext";

const IntroAnimation = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { isComplete } = useIntro();

    useIntroAnime({ sectionRef });

    if (isComplete) return null;

    return (
        <section 
            ref={sectionRef} 
            className="fixed inset-0 z-100 flex items-center justify-center bg-grey-200 overflow-hidden select-none"
        >
            {/* Main Branding Reveal */}
            <div className="stage-2 absolute flex flex-col items-center justify-center text-center opacity-0">
                <div className="logo-wrap flex flex-col items-center">
                    {/* The 224 */}
                    <h1 className="title-224 text-7xl md:text-8xl font-sans font-bold tracking-[-0.02em] text-grey-700 leading-none mb-2 flex gap-1 justify-center">
                        <span className="inline-block">2</span>
                        <span className="inline-block">2</span>
                        <span className="inline-block">4</span>
                    </h1>
                    {/* The REELS */}
                    <h2 className="title-reels text-sm md:text-base font-sans font-semibold text-grey-500 uppercase pl-[1.2em]">
                        REELS
                    </h2>
                </div>
                {/* Bottom credits / establishment */}
                {/* <div className="stage-2-meta mt-12 flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] text-grey-400 uppercase">
                    <span>EST. 2026</span>
                    <span className="w-1 h-1 bg-grey-400 rounded-full" />
                    <span>CREATIVE FILM</span>
                </div> */}
            </div>
        </section>
    );
};

export default IntroAnimation;