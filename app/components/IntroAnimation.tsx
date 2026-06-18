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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d] overflow-hidden select-none"
        >
            {/* STAGE 1: Minimalist Symbol & Tagline */}
            <div className="stage-1 absolute flex flex-col items-center justify-center">
                {/* Minimalist SVG Film Shutter / Geometric Reel Symbol */}
                <div className="logo-symbol mb-6">
                    <svg className="w-12 h-12 text-[#DADADA]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M50 5L50 95" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                        <path d="M5 50L95 50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                        {/* Shutter blades / geometric accents */}
                        <path d="M35 35L65 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M65 35L35 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 className="tagline text-[10px] uppercase tracking-[0.6em] text-[#8A8A8A] font-mono pl-[0.6em]">
                    STORIES IN MOTION
                </h3>
            </div>

            {/* STAGE 2: Main Branding Reveal */}
            <div className="stage-2 absolute flex flex-col items-center justify-center text-center opacity-0">
                <div className="logo-wrap flex flex-col items-center">
                    {/* Tiny accent symbol */}
                    <div className="stage-2-dot mb-4">
                        <span className="block w-1.5 h-1.5 bg-[#E10600] rounded-full animate-pulse" />
                    </div>
                    {/* The 224 */}
                    <h1 className="title-224 text-7xl md:text-8xl font-sans font-extrabold tracking-[-0.04em] text-[#F5F5F5] leading-none mb-2">
                        224
                    </h1>
                    {/* The REELS */}
                    <h2 className="title-reels text-sm md:text-base font-sans font-medium text-[#DADADA] uppercase pl-[1.2em]">
                        REELS
                    </h2>
                </div>
                {/* Bottom credits / establishment */}
                <div className="stage-2-meta mt-12 flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] text-[#8A8A8A] uppercase">
                    <span>EST. 2026</span>
                    <span className="w-1 h-1 bg-[#8A8A8A] rounded-full" />
                    <span>CREATIVE FILM</span>
                </div>
            </div>
        </section>
    );
};

export default IntroAnimation;