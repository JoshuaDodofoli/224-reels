import { useRef, useState, useCallback, useEffect } from "react";
import { useLenis } from "lenis/react";

const EASE = "cubic-bezier(.49, .34, .01, 1)";
const EXPAND_MS = 800;
const COLLAPSE_MS = 900;
const CONTROLS_DELAY_MS = 900;

const waitForNextPaint = (callback: () => void) => {
    requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
};

type VideoRect = Pick<DOMRect, "top" | "left" | "width" | "height">;
const getVideoRect = (element: HTMLElement): VideoRect => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
};

type Phase = "idle" | "expanding" | "expanded" | "collapsing";

export const useVideoExpansion = (onExpandComplete?: () => void, onCollapseStart?: () => void) => {
    const lenis = useLenis();
    const placeholderRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const animationTimeoutRef = useRef<number | null>(null);
    const savedRectRef = useRef<VideoRect | null>(null);

    const [phase, setPhase] = useState<Phase>("idle");
    const [showControls, setShowControls] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

    const isExpanded = phase === "expanded";
    const isAnimating = phase === "expanding" || phase === "collapsing";

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                window.clearTimeout(animationTimeoutRef.current);
            }
            lenis?.start();
        };
    }, [lenis]);

    const getExpandedTargetStyles = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            return {
                top: "calc(50dvh - (100vw * 9 / 16) / 2)",
                left: "0",
                width: "100vw",
                height: "calc(100vw * 9 / 16)",
            };
        }
        return {
            top: "0",
            left: "0",
            width: "100vw",
            height: "100dvh",
        };
    };

    const expandVideo = useCallback((playAfterExpand = false) => {
        const placeholder = placeholderRef.current;
        const wrapper = wrapperRef.current;
        if (!placeholder || !wrapper || isAnimating || isExpanded) return;

        const rect = getVideoRect(placeholder);
        savedRectRef.current = rect;

        if (animationTimeoutRef.current) window.clearTimeout(animationTimeoutRef.current);

        lenis?.stop();
        setPhase("expanding");
        setShowControls(false);
        setShowPoster(true);

        wrapper.style.transition = "none";
        wrapper.style.position = "fixed";
        wrapper.style.top = `${rect.top}px`;
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height}px`;
        wrapper.style.zIndex = "110";
        wrapper.style.margin = "0";
        wrapper.style.maxWidth = "none";

        waitForNextPaint(() => {
            const target = getExpandedTargetStyles();
            wrapper.style.transition = `top ${EXPAND_MS}ms ${EASE}, left ${EXPAND_MS}ms ${EASE}, width ${EXPAND_MS}ms ${EASE}, height ${EXPAND_MS}ms ${EASE}`;
            wrapper.style.top = target.top;
            wrapper.style.left = target.left;
            wrapper.style.width = target.width;
            wrapper.style.height = target.height;

            animationTimeoutRef.current = window.setTimeout(() => {
                setPhase("expanded");
                animationTimeoutRef.current = null;

                animationTimeoutRef.current = window.setTimeout(() => {
                    setShowControls(true);
                    animationTimeoutRef.current = null;
                }, CONTROLS_DELAY_MS - EXPAND_MS);

                if (playAfterExpand) {
                    onExpandComplete?.();
                    setShowPoster(false);
                }
            }, EXPAND_MS);
        });
    }, [isAnimating, isExpanded, lenis, onExpandComplete]);

    const collapseVideo = useCallback(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !isExpanded || isAnimating) return;
        const rect = savedRectRef.current;
        if (!rect) return;

        if (animationTimeoutRef.current) window.clearTimeout(animationTimeoutRef.current);

        onCollapseStart?.();
        setShowControls(false);
        setPhase("collapsing");
        setShowPoster(true);

        waitForNextPaint(() => {
            wrapper.style.transition = `top ${COLLAPSE_MS}ms ${EASE}, left ${COLLAPSE_MS}ms ${EASE}, width ${COLLAPSE_MS}ms ${EASE}, height ${COLLAPSE_MS}ms ${EASE}`;
            wrapper.style.top = `${rect.top}px`;
            wrapper.style.left = `${rect.left}px`;
            wrapper.style.width = `${rect.width}px`;
            wrapper.style.height = `${rect.height}px`;

            animationTimeoutRef.current = window.setTimeout(() => {
                wrapper.style.transition = "none";
                wrapper.style.position = "";
                wrapper.style.top = "";
                wrapper.style.left = "";
                wrapper.style.width = "";
                wrapper.style.height = "";
                wrapper.style.zIndex = "";
                wrapper.style.margin = "";
                wrapper.style.maxWidth = "";

                setPhase("idle");
                savedRectRef.current = null;
                animationTimeoutRef.current = null;
                lenis?.start();
            }, COLLAPSE_MS);
        });
    }, [isAnimating, isExpanded, lenis, onCollapseStart]);

    return {
        placeholderRef,
        wrapperRef,
        phase,
        isExpanded,
        isAnimating,
        showControls,
        showPoster,
        setShowPoster,
        expandVideo,
        collapseVideo,
        EXPAND_MS,
        COLLAPSE_MS,
        EASE
    };
};
