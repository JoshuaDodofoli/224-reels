'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

interface FloatingButtonProps {
    reelTitle?: string;
    next: () => void;
    prev: () => void;
    allTitles?: string[];
    currentIndex?: number;
    onTitleClick?: (index: number) => void;
}

const FloatingButton = ({ reelTitle, next, prev, allTitles = [], currentIndex = 0, onTitleClick }: FloatingButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const titleRefContainer = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

    useGSAP(() => {
        if (!titleRefContainer.current || !titleRef.current) return;

        gsap.to(titleRefContainer.current, {
            width: 'auto',
            duration: 0.3,
            ease: 'power2.inOut',
        });

        gsap.fromTo(
            titleRef.current,
            {
                opacity: 0,
                y: 10,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            }
        );
    }, [reelTitle]);

    useGSAP(() => {
        if (!listRef.current) return;

        if (isExpanded) {
            gsap.to(listRef.current, {
                height: 'auto',
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
                stagger: 0.05,
            });

            gsap.fromTo(
                itemsRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.1,
                    ease: 'circ.out',
                    stagger: {
                        each: 0.08,
                        from: 'start',
                    },
                }
            );
        } else {
            gsap.to(itemsRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: 'power2.in',
                stagger: {
                    each: 0.05,
                    from: 'end',
                },
            });

            gsap.to(listRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
            });
        }
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleTitleSelect = (index: number) => {
        onTitleClick?.(index);
        setIsExpanded(false);
    };

    return (
        <div ref={titleRefContainer} className="text-background flex flex-col items-center gap-2">
            <ul
                ref={listRef}
                className="overflow-hidden opacity-0 h-0 bg-grey-500/30 backdrop-blur-xl rounded-lg w-full max-w-xs" 
            >
                {allTitles.map((title, idx) => (
                    <li
                        key={idx}
                        ref={(el) => { itemsRef.current[idx] = el; }}
                        onClick={() => handleTitleSelect(idx)}
                        className="px-4 py-2 text-body font-sans cursor-pointer hover:bg-grey-500/50 transition-colors flex justify-between"
                    >
                        {title}
                        {idx === currentIndex && <span className="ml-2"> ←</span>}
                    </li>
                ))}
            </ul>

            <div className="flex rounded-full items-center justify-center gap-2 bg-grey-500/30 backdrop-blur-xl p-2"> 
                <button
                    onClick={prev}
                    className="radius button-style size-8 flex items-center justify-center text-body hover:bg-grey-500/50 transition-colors"
                    aria-label="Previous"
                >
                    ◄
                </button>
                <div
                    onClick={toggleExpand}
                    className="radius button-style px-4 h-8 flex items-center justify-center text-body font-sans whitespace-nowrap overflow-hidden cursor-pointer hover:bg-grey-500/50 transition-colors"
                >
                    <span ref={titleRef}>
                        {reelTitle}
                    </span>
                </div>
                <button
                    onClick={next}
                    className="radius button-style size-8 flex items-center justify-center text-body hover:bg-grey-500/50 transition-colors" 
                    aria-label="Next"
                >
                    ►
                </button>
            </div>
        </div>
    );
};

export default FloatingButton;