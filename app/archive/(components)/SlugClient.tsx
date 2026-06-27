"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { Reel } from "@/app/utils/data";
import Wrapper from "@/app/components/Wrapper";
import Nav from "@/app/components/navbar/Nav";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type ElementRef,
    type PointerEvent,
} from "react";
import { useScrollToNext } from "@/app/utils/hooks/useScrollToNext";
import { useLenis } from 'lenis/react';

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

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
};

const SlugClient = ({ reel, reels }: SlugProps) => {
    const lenis = useLenis();
    const currentIndex = reels.findIndex((r) => r.slug === reel.slug);
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextReel = reels[(safeCurrentIndex + 1) % reels.length] ?? reel;

    const playerRef = useRef<ElementRef<typeof MuxPlayer>>(null);
    const leftBarRef = useRef<HTMLDivElement>(null);
    const rightBarRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCursorInVideo, setIsCursorInVideo] = useState(false);

    const placeholderRef = useRef<HTMLDivElement>(null);
    const savedRectRef = useRef<DOMRect | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedStyles, setExpandedStyles] = useState<React.CSSProperties>({});

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Generate 4 thumbnail timestamps evenly spaced across the video
    const thumbnails = duration > 0 && reel.video ? Array.from({ length: 4 }).map((_, i) => {
        const segment = duration / 4;
        return (i * segment + segment / 2).toFixed(2);
    }) : [];

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

    const expandVideo = () => {
        const placeholder = placeholderRef.current;
        if (!placeholder) return;
        
        // Measure and SAVE the rect now — used again on collapse
        const rect = placeholder.getBoundingClientRect();
        savedRectRef.current = rect;
        
        setIsExpanded(true);
        setIsAnimating(true);
        lenis?.stop();
        
        // Initial state — snap to exact placeholder bounds (no transition)
        setExpandedStyles({
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            zIndex: 100,
            transition: 'none',
            margin: 0,
            maxWidth: 'none'
        });
        
        // After a tiny delay (to ensure the browser painted the initial fixed position),
        // animate out to full viewport
        setTimeout(() => {
            setExpandedStyles({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 100,
                transition: 'all 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
                margin: 0,
                maxWidth: 'none'
            });
            setTimeout(() => setIsAnimating(false), 700);
        }, 50);
    };

    const collapseVideo = () => {
        // Use the rect we saved at expand time — not a re-measure (which may differ if layout shifted)
        const rect = savedRectRef.current;
        if (!rect) return;
        
        setIsAnimating(true);
        
        // Animate the fixed container back to its original position
        setExpandedStyles({
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            zIndex: 100,
            transition: 'all 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
            margin: 0,
            maxWidth: 'none'
        });
        
        setTimeout(() => {
            setIsExpanded(false);
            setIsAnimating(false);
            setExpandedStyles({});
            savedRectRef.current = null;
            lenis?.start();
        }, 700);
    };

    const togglePlay = () => {
        const player = playerRef.current;
        if (!player) return;

        if (player.paused) {
            if (!isExpanded && !isAnimating) expandVideo();
            void player.play();
        } else {
            player.pause();
        }
    };

    const handleCloseExpanded = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const player = playerRef.current;
        if (player) player.pause();
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
                            {reel.type} <span className="opacity-50 mx-2">|</span> {reel.date}
                        </div>
                    </div>

                    {/* Video Section */}
                    <div ref={placeholderRef} className="relative w-full max-w-lg mx-auto aspect-video">
                        <div 
                            className="bg-grey-700 overflow-hidden"
                            style={isExpanded ? expandedStyles : { position: 'absolute', inset: 0, width: '100%', height: '100%', transition: 'all 0.7s cubic-bezier(0.76, 0, 0.24, 1)' }}
                        >
                            {/* Close button for expanded view */}
                            <div 
                                className={`absolute top-0 right-0 z-[110] p-6 md:px-12 md:py-10 transition-opacity duration-500 ${isExpanded && !isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <button 
                                    onClick={handleCloseExpanded}
                                    className="font-sans text-sm md:text-base uppercase tracking-widest hover:opacity-60 transition-opacity text-white mix-blend-difference cursor-pointer"
                                >
                                    + Close
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
                                    className="absolute inset-0 w-full h-full bg-black"
                                    style={fullVideoStyles}
                                    onLoadedMetadata={syncTime}
                                    onDurationChange={syncTime}
                                    onTimeUpdate={syncTime}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onVolumeChange={() => setIsMuted(Boolean(playerRef.current?.muted))}
                                />
                                <div
                                    onPointerEnter={() => setIsCursorInVideo(true)}
                                    onPointerLeave={() => setIsCursorInVideo(false)}
                                    className="group absolute inset-0 z-10"
                                >
                                    {/* Invisible full overlay to catch hover events */}
                                    <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />
                                    
                                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isExpanded ? 'opacity-0' : (!isPlaying || isCursorInVideo ? 'opacity-100' : 'opacity-0')}`}>
                                        <button
                                            type="button"
                                            onClick={togglePlay}
                                            className="pointer-events-auto relative flex items-center justify-center bg-grey-400/20 backdrop-blur-sm text-grey-200 rounded-full transition-all duration-300 ease-out group-hover:w-12 w-24 h-12 shadow-lg overflow-hidden"
                                        >
                                            <span className="flex items-center justify-center transition-all duration-300 ease-out translate-y-0 opacity-100 group-hover:-translate-y-8 group-hover:opacity-0 font-sans uppercase text-xs font-bold tracking-widest">
                                                {isPlaying ? "Pause" : "Play"}
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
                                <div className={`absolute inset-x-0 bottom-0 z-30 px-4 pb-6 md:px-6 transition-opacity duration-300 ${isExpanded && !isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    <div className="mb-4 flex items-center justify-between font-sans text-sm text-white drop-shadow-md">
                                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                                        <button type="button" onClick={toggleMute} className="transition-opacity duration-300 hover:opacity-60">{isMuted ? "Unmute" : "Mute"}</button>
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
                                        style={{ ["--progress" as string]: `${progress}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <Image src={reel.img} alt={reel.title} fill priority className="object-cover object-center" />
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
