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
 * When the page is pinned at the bottom, accumulates extra downward wheel/touch
 * scroll delta into a 0→1 progress value and navigates to `href` (via the page
 * transition) once it crosses the threshold.
 *
 * Progress is strictly monotonic: it never decays and never resets while the
 * user stays on the page. This matters on mobile, where reaching the bottom
 * collapses the browser toolbar and shifts the page — anything that reset on
 * "left the bottom" would wipe the progress and feel broken. Upward scroll is
 * ignored rather than subtracted. Holds no React state — `onProgress` drives the UI.
 */
export function useScrollToNext(href: string, { onProgress, threshold = 700 }: Options) {
    const { transitionTo } = useTransition();

    const accRef = useRef(0);
    const atBottomRef = useRef(false);
    const navigatedRef = useRef(false);

    // Keep latest callback without re-subscribing listeners.
    const onProgressRef = useRef(onProgress);
    useEffect(() => {
        onProgressRef.current = onProgress;
    });

    // Track whether Lenis is pinned at the bottom of the page. Note: we only
    // read this flag — we never reset progress when it goes false.
    useLenis((lenis) => {
        atBottomRef.current = lenis.limit > 0 && lenis.scroll >= lenis.limit - 2;
    });

    useEffect(() => {
        // Reset only for a fresh page (href change / mount), never mid-interaction.
        navigatedRef.current = false;
        accRef.current = 0;
        onProgressRef.current(0);

        const add = (delta: number) => {
            // Only count downward overscroll while pinned at the bottom.
            if (navigatedRef.current || !atBottomRef.current || delta <= 0) return;
            accRef.current = Math.min(threshold, accRef.current + delta);
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

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, [href, threshold, transitionTo]);
}
