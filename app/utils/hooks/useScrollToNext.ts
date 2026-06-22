'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { useTransition } from '@/app/components/transition/TransitionContext';

interface Options {
    /** Callback fired with the 0→1 overscroll progress. Drive the indicator imperatively here. */
    onProgress: (progress: number) => void;
    /** Pixels of accumulated overscroll required to trigger navigation. */
    threshold?: number;
}

/**
 * When the page is pinned at the bottom, accumulates extra wheel/touch scroll
 * delta into a 0→1 progress value and navigates to `href` (via the page
 * transition) once it crosses the threshold. Progress recedes if the user
 * pauses or scrolls back up. Holds no React state — `onProgress` drives the UI.
 */
export function useScrollToNext(href: string, { onProgress, threshold = 700 }: Options) {
    const { transitionTo } = useTransition();

    const accRef = useRef(0);
    const atBottomRef = useRef(false);
    const navigatedRef = useRef(false);
    const lastInputRef = useRef(0);

    // Keep latest callback without re-subscribing listeners.
    const onProgressRef = useRef(onProgress);
    onProgressRef.current = onProgress;

    // Track whether Lenis is pinned at the bottom of the page.
    useLenis((lenis) => {
        const atBottom = lenis.limit > 0 && lenis.scroll >= lenis.limit - 2;
        atBottomRef.current = atBottom;
        if (!atBottom && !navigatedRef.current && accRef.current !== 0) {
            accRef.current = 0;
            onProgressRef.current(0);
        }
    });

    useEffect(() => {
        // Reset for the current page.
        navigatedRef.current = false;
        accRef.current = 0;
        onProgressRef.current(0);

        const add = (delta: number) => {
            if (navigatedRef.current || !atBottomRef.current) return;
            lastInputRef.current = performance.now();
            accRef.current = Math.max(0, Math.min(threshold, accRef.current + delta));
            const p = accRef.current / threshold;
            onProgressRef.current(p);
            if (p >= 1) {
                navigatedRef.current = true;
                onProgressRef.current(1);
                transitionTo(href);
            }
        };

        const onWheel = (e: WheelEvent) => add(e.deltaY);

        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => {
            touchY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            add((touchY - y) * 2); // swiping up = scrolling down
            touchY = y;
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });

        // Ease progress back down when input pauses short of the threshold.
        let raf = requestAnimationFrame(function decay() {
            raf = requestAnimationFrame(decay);
            if (navigatedRef.current) return;
            if (accRef.current > 0 && performance.now() - lastInputRef.current > 120) {
                accRef.current *= 0.92;
                if (accRef.current < 1) accRef.current = 0;
                onProgressRef.current(accRef.current / threshold);
            }
        });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            cancelAnimationFrame(raf);
        };
    }, [href, threshold, transitionTo]);
}
