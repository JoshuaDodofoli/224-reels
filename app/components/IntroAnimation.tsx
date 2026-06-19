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
            <div className="stage-2 absolute flex flex-col items-center justify-center text-center">
                <div className="logo-wrap flex flex-col items-center">
                    {/* The 224 */}
                    <h1 className="title-224 text-7xl md:text-8xl font-sans font-bold tracking-[-0.02em] text-grey-700 leading-none mb-2 flex gap-1 justify-center overflow-hidden">
                        <span className="char inline-block will-change-transform opacity-0">2</span>
                        <span className="char inline-block will-change-transform opacity-0">2</span>
                        <span className="char inline-block will-change-transform opacity-0">4</span>
                    </h1>
                    {/* Accent line drawn between the wordmark and the tagline */}
                    <span className="accent-line block h-px w-full bg-grey-500/60 origin-left scale-x-0 mt-1 mb-2" />
                    {/* The REELS — wrapped in a mask for a wipe reveal */}
                    <div className="reels-mask overflow-hidden">
                        <h2 className="title-reels text-sm md:text-base font-sans font-semibold tracking-[0.4em] text-grey-500 uppercase pl-[1.2em] will-change-transform opacity-0">
                            REELS
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntroAnimation;