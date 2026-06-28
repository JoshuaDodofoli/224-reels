"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { Reel } from "@/app/utils/data";
import Nav from "@/app/components/navbar/Nav";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type ElementRef,
    type MouseEvent,
} from "react";
import { useScrollToNext } from "@/app/utils/hooks/useScrollToNext";
import { useLenis } from "lenis/react";

interface SlugProps {
    reel: Reel;
    reels: Reel[];
}

const fullVideoStyles = {
    ["--controls" as string]: "none",
    ["--media-object-fit" as string]: "cover",
    ["--media-object-position" as string]: "center",
};

const previewVideoStyles = {
    ["--controls" as string]: "none",
    ["--media-object-fit" as string]: "cover",
    ["--media-object-position" as string]: "center",
};

// freshman.tv easing: cubic-bezier(.49, .34, .01, 1)
const EASE = "cubic-bezier(.49, .34, .01, 1)";
const EXPAND_MS = 800;
const COLLAPSE_MS = 900;
const CONTROLS_DELAY_MS = 900; // delay before controls/title fade in after expand

const waitForNextPaint = (callback: () => void) => {
    requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
};

type VideoRect = Pick<DOMRect, "top" | "left" | "width" | "height">;

const getVideoRect = (element: HTMLElement): VideoRect => {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
    };
};

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
};

// State machine for the animation phases
// idle → expanding → expanded → collapsing → idle
type Phase = "idle" | "expanding" | "expanded" | "collapsing";

const SlugClient = ({ reel, reels }: SlugProps) => {
    const lenis = useLenis();
    const currentIndex = reels.findIndex((r) => r.slug === reel.slug);
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextReel = reels[(safeCurrentIndex + 1) % reels.length] ?? reel;
    const posterSrc = reel.video
        ? `https://image.mux.com/${reel.video}/thumbnail.webp`
        : reel.img;

    const playerRef = useRef<ElementRef<typeof MuxPlayer>>(null);
    const animationTimeoutRef = useRef<number | null>(null);
    const leftBarRef = useRef<HTMLDivElement>(null);
    const rightBarRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);

    // The ref on the placeholder (for measuring the thumbnail rect)
    const placeholderRef = useRef<HTMLDivElement>(null);
    // The ref on the video wrapper div that we animate
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCursorInVideo, setIsCursorInVideo] = useState(false);

    const savedRectRef = useRef<VideoRect | null>(null);
    const [phase, setPhase] = useState<Phase>("idle");
    // Controls/title visibility — fades in after expansion finishes
    const [showControls, setShowControls] = useState(false);
    // Whether the video image poster should be shown (during transition and when not playing)
    const [showPoster, setShowPoster] = useState(true);

    const isExpanded = phase === "expanded";
    const isAnimating = phase === "expanding" || phase === "collapsing";

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    useScrollToNext(`/archive/${nextReel.slug}`, {
        onProgress: (p) => {
            const t = `scaleX(${p})`;
            if (leftBarRef.current) leftBarRef.current.style.transform = t;
            if (rightBarRef.current) rightBarRef.current.style.transform = t;
            if (mobileBarRef.current) mobileBarRef.current.style.transform = t;
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [reel.slug]);

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                window.clearTimeout(animationTimeoutRef.current);
            }
            lenis?.start();
        };
    }, [lenis]);

    const syncTime = useCallback(() => {
        const player = playerRef.current;
        if (!player) return;

        setCurrentTime(player.currentTime || 0);
        setDuration(player.duration || 0);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        let animationFrameId = 0;

        const tick = () => {
            syncTime();
            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, syncTime]);

    // Helper to determine target dimensions for expansion
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

    // ─── Freshman.tv-style expand ──────────────────────────────────────────────
    // Instead of swapping a poster clone, we animate the real wrapper div:
    //   1. Measure the placeholder rect
    //   2. Position the wrapper at that rect with no transition
    //   3. On the next paint, apply the transition and move to target dimensions
    //   4. After the animation, switch phase to "expanded"
    const expandVideo = (playAfterExpand = false) => {
        const placeholder = placeholderRef.current;
        const wrapper = wrapperRef.current;
        if (!placeholder || !wrapper || isAnimating || isExpanded) return;

        const rect = getVideoRect(placeholder);
        savedRectRef.current = rect;

        if (animationTimeoutRef.current) {
            window.clearTimeout(animationTimeoutRef.current);
        }

        lenis?.stop();
        setPhase("expanding");
        setShowControls(false);
        setShowPoster(true);

        // Snap wrapper to thumbnail rect (no transition)
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
            // Apply transition and animate to target dimensions
            const transition = `top ${EXPAND_MS}ms ${EASE}, left ${EXPAND_MS}ms ${EASE}, width ${EXPAND_MS}ms ${EASE}, height ${EXPAND_MS}ms ${EASE}`;
            wrapper.style.transition = transition;
            wrapper.style.top = target.top;
            wrapper.style.left = target.left;
            wrapper.style.width = target.width;
            wrapper.style.height = target.height;

            animationTimeoutRef.current = window.setTimeout(() => {
                // Animation complete — switch to expanded phase
                setPhase("expanded");
                animationTimeoutRef.current = null;

                // Fade in controls after a short delay (freshman.tv does 1s delay)
                animationTimeoutRef.current = window.setTimeout(() => {
                    setShowControls(true);
                    animationTimeoutRef.current = null;
                }, CONTROLS_DELAY_MS - EXPAND_MS);

                if (playAfterExpand) {
                    void playerRef.current?.play();
                    setShowPoster(false);
                }
            }, EXPAND_MS);
        });
    };

    // ─── Freshman.tv-style collapse ────────────────────────────────────────────
    // Animate the wrapper back from fullscreen → thumbnail rect, then reset
    const collapseVideo = () => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !isExpanded || isAnimating) return;

        const rect = savedRectRef.current;
        if (!rect) return;

        if (animationTimeoutRef.current) {
            window.clearTimeout(animationTimeoutRef.current);
        }

        playerRef.current?.pause();
        setIsPlaying(false);
        setIsCursorInVideo(false);
        setShowControls(false);
        setPhase("collapsing");
        setShowPoster(true);

        waitForNextPaint(() => {
            const transition = `top ${COLLAPSE_MS}ms ${EASE}, left ${COLLAPSE_MS}ms ${EASE}, width ${COLLAPSE_MS}ms ${EASE}, height ${COLLAPSE_MS}ms ${EASE}`;
            wrapper.style.transition = transition;
            wrapper.style.top = `${rect.top}px`;
            wrapper.style.left = `${rect.left}px`;
            wrapper.style.width = `${rect.width}px`;
            wrapper.style.height = `${rect.height}px`;

            animationTimeoutRef.current = window.setTimeout(() => {
                // Reset wrapper back to static styles
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
    };

    const togglePlay = () => {
        const player = playerRef.current;
        if (!player || isAnimating) return;

        if (!isExpanded) {
            expandVideo(true);
            return;
        }

        if (player.paused) {
            void player.play();
            setShowPoster(false);
        } else {
            player.pause();
        }
    };

    const handleCloseExpanded = (e?: MouseEvent) => {
        e?.stopPropagation();
        collapseVideo();
    };

    const toggleMute = () => {
        const player = playerRef.current;
        if (!player) return;

        player.muted = !player.muted;
        setIsMuted(player.muted);
    };

    const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
        const player = playerRef.current;
        const nextTime = Number(event.target.value);

        setCurrentTime(nextTime);
        if (player) player.currentTime = nextTime;
    };

    return (
        <div>
            <div className="relative z-10 min-h-screen bg-grey-200  shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
                {/* Header Area */}
                <Nav />

                <div className="flex-1 flex flex-col justify-center w-full px-4 md:px-12">
                    {/* Title Section */}
                    <div className="w-full max-w-lg mx-auto mb-8 flex flex-col items-center text-center">
                        <h1 className="text-h2 md:text-h1 leading-[0.9] font-sans uppercase tracking-tighter text-grey-700">
                            {reel.title}
                        </h1>
                        <div className="mt-6 font-sans text-caption font-bold uppercase tracking-widest text-grey-450">
                            {reel.type}{" "}
                            <span className="opacity-50 mx-2">|</span>{" "}
                            {reel.date}
                        </div>
                    </div>

                    {/* Video Section — placeholder keeps layout space */}
                    <div
                        ref={placeholderRef}
                        className="relative w-full max-w-lg mx-auto aspect-video"
                    >
                        {/*
                         * Dark overlay — fades in during expansion, out during collapse.
                         * Placed OUTSIDE the wrapper so it covers the full viewport behind the video.
                         */}
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 100, // Background dimming layer (wrapper is 110)
                                backgroundColor: "rgb(16,16,16)",
                                opacity: isExpanded || phase === "expanding" ? 1 : 0,
                                transition: phase === "expanding"
                                    ? `opacity ${EXPAND_MS}ms ${EASE}`
                                    : phase === "collapsing"
                                    ? `opacity ${COLLAPSE_MS}ms ${EASE}`
                                    : "none",
                                pointerEvents: "none",
                            }}
                        />

                        {/*
                         * The wrapper is always mounted. During idle it sits absolutely
                         * within the placeholder. During expand/collapse the JS above
                         * applies fixed positioning via inline styles, animating it to
                         * and from fullscreen — exactly as freshman.tv does it.
                         */}
                        <div
                            ref={wrapperRef}
                            className="bg-grey-700 overflow-hidden"
                            style={{
                                // Default (idle) styles — JS overrides when animating
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        >

                            {/* Title (top-left) — fades in with blur after expansion, like freshman.tv */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    zIndex: 30,
                                    padding: "1.5rem 1.5rem",
                                    opacity: showControls ? 1 : 0,
                                    filter: showControls ? "blur(0px)" : "blur(12px)",
                                    transition: showControls
                                        ? "opacity 1000ms ease, filter 1000ms ease"
                                        : "opacity 300ms ease, filter 300ms ease",
                                    pointerEvents: showControls ? "auto" : "none",
                                }}
                                className="md:px-12 md:py-10"
                            >
                                <span className="font-sans text-caption md:text-xs uppercase tracking-widest text-white/70">
                                    {reel.title}
                                </span>
                            </div>

                            {/* Close button (top-right) — fades in with blur after expansion */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    zIndex: 30,
                                    padding: "1.5rem 1.5rem",
                                    opacity: showControls ? 1 : 0,
                                    filter: showControls ? "blur(0px)" : "blur(12px)",
                                    transition: showControls
                                        ? "opacity 1000ms ease, filter 1000ms ease"
                                        : "opacity 300ms ease, filter 300ms ease",
                                    pointerEvents: showControls ? "auto" : "none",
                                }}
                                className="md:px-12 md:py-10"
                            >
                                <button
                                    onClick={handleCloseExpanded}
                                    className="font-sans text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity text-white cursor-pointer"
                                >
                                    Close ×
                                </button>
                            </div>

                            {/* Main Video logic */}
                            {reel.video ? (
                                <>
                                    <MuxPlayer
                                        key={reel.slug}
                                        ref={playerRef}
                                        playbackId={reel.video}
                                        streamType="on-demand"
                                        playsInline
                                        className="absolute inset-0 w-full h-full bg-grey-700"
                                        style={{ ...fullVideoStyles, zIndex: 10 }}
                                        onLoadedMetadata={syncTime}
                                        onDurationChange={syncTime}
                                        onTimeUpdate={syncTime}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onVolumeChange={() =>
                                            setIsMuted(
                                                Boolean(
                                                    playerRef.current?.muted,
                                                ),
                                            )
                                        }
                                    />
                                    <Image
                                        src={posterSrc}
                                        alt=""
                                        fill
                                        priority
                                        sizes={
                                            isExpanded
                                                ? "100vw"
                                                : "(max-width: 768px) 100vw, 512px"
                                        }
                                        style={{ zIndex: 11 }}
                                        className={`absolute inset-0 object-cover transition-opacity duration-300 ${
                                            showPoster
                                                ? "opacity-100"
                                                : "opacity-0 pointer-events-none"
                                        }`}
                                    />

                                    {/* Interaction overlay */}
                                    <div
                                        onPointerEnter={() =>
                                            setIsCursorInVideo(true)
                                        }
                                        onPointerLeave={() =>
                                            setIsCursorInVideo(false)
                                        }
                                        className="group absolute inset-0"
                                        style={{ zIndex: 20 }}
                                    >
                                        {/* Invisible click target */}
                                        <div
                                            className="absolute inset-0 cursor-pointer"
                                            onClick={togglePlay}
                                        />

                                        {/* Play/Pause button — hidden when expanded */}
                                        <div
                                            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isExpanded ? "opacity-0" : !isPlaying || isCursorInVideo ? "opacity-100" : "opacity-0"}`}
                                        >
                                            <button
                                                type="button"
                                                onClick={togglePlay}
                                                className="pointer-events-auto relative flex items-center justify-center bg-grey-400/20 backdrop-blur-sm text-grey-200 rounded-full transition-all duration-300 ease-out group-hover:w-12 w-24 h-12 shadow-lg overflow-hidden"
                                            >
                                                <span className="flex items-center justify-center transition-all duration-300 ease-out translate-y-0 opacity-100 group-hover:-translate-y-8 group-hover:opacity-0 font-sans uppercase text-xs font-bold tracking-widest">
                                                    {isPlaying
                                                        ? "Pause"
                                                        : "Play"}
                                                </span>
                                                <svg
                                                    className={`absolute transition-all duration-300 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-5 h-5 ${!isPlaying ? "ml-1" : ""}`}
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    {isPlaying ? (
                                                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                                                    ) : (
                                                        <path d="M8 5v14l11-7z" />
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Playback controls (bottom) — fade in with blur after expand */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 30,
                                            padding: "0 1rem 1.5rem",
                                            opacity: showControls ? 1 : 0,
                                            filter: showControls ? "blur(0px)" : "blur(12px)",
                                            transition: showControls
                                                ? "opacity 1000ms ease, filter 1000ms ease"
                                                : "opacity 300ms ease, filter 300ms ease",
                                            pointerEvents: showControls ? "auto" : "none",
                                        }}
                                        className="md:px-6"
                                    >
                                        <div className="mb-4 flex items-center justify-between font-sans text-xs md:text-sm text-white drop-shadow-md">
                                            <span>
                                                {formatTime(currentTime)} /{" "}
                                                {formatTime(duration)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={toggleMute}
                                                className="transition-opacity duration-300 hover:opacity-60"
                                            >
                                                {isMuted ? "Unmute" : "Mute"}
                                            </button>
                                        </div>
                                        <input
                                            aria-label="Seek video"
                                            type="range"
                                            min={0}
                                            max={duration || 0}
                                            step="0.01"
                                            value={duration ? currentTime : 0}
                                            onChange={handleSeek}
                                            className="minimal-video-range"
                                            style={{
                                                ["--progress" as string]: `${progress}%`,
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={reel.img}
                                    alt={reel.title}
                                    fill
                                    priority
                                    className="object-cover object-center"
                                />
                            )}
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="mt-8 w-full max-w-lg mx-auto flex flex-col items-center text-center gap-8">
                        {/* <span className="text-sm font-sans uppercase tracking-widest text-grey-500 font-medium">
                            (Overview)
                        </span> */}
                        <p className="text-body font-sans text-grey-450">
                            {reel.desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* footer */}

            <div className="sticky bottom-0 z-0 h-[80vh] flex flex-col justify-end">
                <TransitionLink
                    href={`/archive/${nextReel.slug}`}
                    className="group block w-full"
                >
                    <div className="relative w-full h-[80vh] overflow-hidden">
                        {nextReel.video ? (
                            <MuxPlayer
                                playbackId={nextReel.video}
                                streamType="on-demand"
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                                style={previewVideoStyles}
                            />
                        ) : (
                            <Image
                                src={nextReel.img}
                                alt={nextReel.title}
                                fill
                                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-grey-700/50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                            <span className="font-sans text-grey-200 text-xs uppercase tracking-widest">
                                {/* Next — {nextReel.type} */}
                                Next up
                            </span>
                            {/* desktop: bars flank the title */}
                            <div className="hidden md:flex items-center gap-6 py-12">
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={leftBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{
                                            transform: "scaleX(0)",
                                            transformOrigin: "right",
                                        }}
                                    />
                                </div>
                                <h2 className="text-h1 font-sans text-grey-200 leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-70">
                                    {nextReel.title}
                                </h2>
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={rightBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{
                                            transform: "scaleX(0)",
                                            transformOrigin: "left",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* mobile: single bar below the title */}
                            <div className="flex md:hidden flex-col items-center gap-16 py-6">
                                <h2 className="text-h2 md:text-h1 font-sans text-grey-200 leading-[0.9] tracking-tight transition-opacity duration-300 group-hover:opacity-70">
                                    {nextReel.title}
                                </h2>
                                <div className="h-px w-40 overflow-hidden bg-grey-200/30">
                                    <div
                                        ref={mobileBarRef}
                                        className="h-full w-full bg-grey-200"
                                        style={{
                                            transform: "scaleX(0)",
                                            transformOrigin: "center",
                                        }}
                                    />
                                </div>
                            </div>

                            <span className="text-caption font-sans text-grey-200 uppercase tracking-widest">
                                keep scrolling
                            </span>
                        </div>
                    </div>
                </TransitionLink>
            </div>
        </div>
    );
};

export default SlugClient;
