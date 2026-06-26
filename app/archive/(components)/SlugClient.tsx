"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { Reel } from "@/app/utils/data";
import Wrapper from "@/app/components/Wrapper";
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
    const currentIndex = reels.findIndex((r) => r.slug === reel.slug);
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextReel = reels[(safeCurrentIndex + 1) % reels.length] ?? reel;

    const playerRef = useRef<ElementRef<typeof MuxPlayer>>(null);
    const playCursorRef = useRef<HTMLDivElement>(null);
    const leftBarRef = useRef<HTMLDivElement>(null);
    const rightBarRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCursorInVideo, setIsCursorInVideo] = useState(false);
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

    const togglePlay = () => {
        const player = playerRef.current;
        if (!player) return;

        if (player.paused) {
            void player.play();
        } else {
            player.pause();
        }
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

    const movePlayCursor = (event: PointerEvent<HTMLElement>) => {
        const label = playCursorRef.current;
        if (!label) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    return (
        <div className="bg-grey-700">
            <div className="relative z-10 min-h-screen bg-grey-200">
                <Wrapper noPadding>
                    <div className="relative w-full h-screen">
                        {reel.video ? (
                            <>
                                <MuxPlayer
                                    key={reel.slug}
                                    ref={playerRef}
                                    playbackId={reel.video}
                                    streamType="on-demand"
                                    playsInline
                                    className="absolute inset-0 w-full h-full bg-grey-700"
                                    style={fullVideoStyles}
                                    onLoadedMetadata={syncTime}
                                    onDurationChange={syncTime}
                                    onTimeUpdate={syncTime}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onVolumeChange={() =>
                                        setIsMuted(
                                            Boolean(playerRef.current?.muted),
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    aria-label={
                                        isPlaying ? "Pause video" : "Play video"
                                    }
                                    onClick={togglePlay}
                                    onPointerEnter={(event) => {
                                        setIsCursorInVideo(true);
                                        movePlayCursor(event);
                                    }}
                                    onPointerMove={movePlayCursor}
                                    onPointerLeave={() =>
                                        setIsCursorInVideo(false)
                                    }
                                    className="absolute inset-0 z-10 cursor-none"
                                />
                                <div
                                    ref={playCursorRef}
                                    className={`pointer-events-none absolute left-0 top-0 z-20 font-sans text-sm lowercase text-grey-200 transition-opacity duration-200 ${
                                        isCursorInVideo
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                    style={{
                                        transform:
                                            "translate3d(22vw, calc(100vh - 7rem), 0) translate(-50%, -50%)",
                                    }}
                                >
                                    {isPlaying ? "pause" : "play"}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 md:px-6">
                                    <div className="mb-4 flex items-center justify-between font-sans text-sm text-grey-200">
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
                        <div className="pointer-events-none absolute left-4 top-6 z-20 font-sans text-sm text-grey-200 md:left-6">
                            {reel.title}
                        </div>
                        <div className="absolute top-4 right-4 z-20">
                            <TransitionLink
                                href="/"
                                className="group inline-flex items-center bg-grey-700 text-white px-2 h-6 overflow-hidden"
                            >
                                <div className="flex flex-col transition-transform duration-500 ease-in-out">
                                    <span className="text-sm h-6 font-sans flex items-center">
                                        Close
                                    </span>
                                </div>
                            </TransitionLink>
                        </div>
                    </div>
                </Wrapper>

                <Wrapper>
                    <div className="py-24 min-h-[60vh] flex flex-col gap-12 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-grey-400 text-xs uppercase tracking-wide">
                                {reel.type}
                            </span>
                            <span className="font-sans text-grey-400 text-xs uppercase tracking-wide">
                                {reel.date}
                            </span>
                        </div>

                        <hr className="border-grey-400" />

                        <div className="grid md:grid-cols-2 gap-10 items-start">
                            <h1 className="text-h2 lg:text-h1 font-sans leading-none tracking-tight">
                                {reel.title}
                            </h1>
                            <p className="text-grey-450 text-body font-sans leading-relaxed">
                                {reel.desc}
                            </p>
                        </div>
                    </div>
                </Wrapper>
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
                                <h2 className="text-h1 font-sans text-grey-200 leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-70">
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
