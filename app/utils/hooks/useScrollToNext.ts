'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { useTransition } from '@/app/components/transition/TransitionContext';

interface Options {
    /** Callback fired with the 0→1 overscroll progress. Drive the indicator imperatively here. */
    onProgress: (progress: number) => void;
    /** Pixels of accumulated overscroll required to trigger navigation. */
    threshold?: number;
    /**
     * How many pixels before the true scroll bottom to start counting overscroll.
     * Increasing this means the progress indicator begins filling earlier, which
     * masks the iOS Safari toolbar-collapse jump (the toolbar collapses when the
     * user first reaches the very bottom, shifting the page). A value of ~150px
     * means the indicator is already partially filled before the jump happens.
     */
    nearBottomOffset?: number;
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
export function useScrollToNext(href: string, { onProgress, threshold = 700, nearBottomOffset = 150 }: Options) {
    const { transitionTo } = useTransition();

    const accRef = useRef(0);          // raw accumulated overscroll (target)
    const displayedPRef = useRef(0);   // smoothed 0→1 value driven by rAF
    const atBottomRef = useRef(false);
    const navigatedRef = useRef(false);
    const rafRef = useRef<number>(0);

    // Keep latest callback without re-subscribing listeners.
    const onProgressRef = useRef(onProgress);
    useEffect(() => {
        onProgressRef.current = onProgress;
    });

    // Track whether Lenis is near the bottom of the page. We use a nearBottomOffset
    // so that overscroll accumulation starts slightly before the true bottom.
    // On iOS Safari, the browser toolbar collapses exactly when the user first
    // hits the bottom, causing a page shift. By starting earlier we mask this.
    // Note: we only read this flag — we never reset progress when it goes false.
    useLenis((lenis) => {
        atBottomRef.current = lenis.limit > 0 && lenis.scroll >= lenis.limit - nearBottomOffset;
    });

    useEffect(() => {
        // Reset only for a fresh page (href change / mount), never mid-interaction.
        navigatedRef.current = false;
        accRef.current = 0;
        displayedPRef.current = 0;
        onProgressRef.current(0);

        // ── rAF lerp loop ────────────────────────────────────────────────────
        // We never write to onProgress directly from scroll events. Instead we
        // accumulate a raw target in accRef and lerp the *displayed* value here
        // every frame. This makes the bar glide regardless of event granularity.
        const LERP = 0.12; // 0 = never moves, 1 = instant — 0.12 feels smooth

        const tick = () => {
            const targetP = Math.min(1, accRef.current / threshold);
            const cur = displayedPRef.current;
            const next = cur + (targetP - cur) * LERP;

            // Only repaint when there's a meaningful visual change.
            if (Math.abs(next - cur) > 0.0005) {
                displayedPRef.current = next;
                onProgressRef.current(next);
            }

            if (!navigatedRef.current && targetP >= 1) {
                navigatedRef.current = true;
                onProgressRef.current(1);
                transitionTo(href);
            }

            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        // ─────────────────────────────────────────────────────────────────────

        const add = (delta: number) => {
            // Only count downward overscroll while near the bottom.
            if (navigatedRef.current || !atBottomRef.current || delta <= 0) return;
            accRef.current = Math.min(threshold, accRef.current + delta);
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
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, [href, threshold, nearBottomOffset, transitionTo]);
}
