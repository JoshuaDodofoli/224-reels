import { useRef, useState, useCallback, useEffect, ElementRef, ChangeEvent } from "react";
import MuxPlayer from "@mux/mux-player-react";

export const useVideoPlayback = () => {
    const playerRef = useRef<ElementRef<typeof MuxPlayer>>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    
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
    
    const togglePlay = useCallback((shouldPlay?: boolean) => {
        const player = playerRef.current;
        if (!player) return;
        
        if (shouldPlay === true) {
            void player.play();
        } else if (shouldPlay === false) {
            player.pause();
        } else {
            if (player.paused) {
                void player.play();
            } else {
                player.pause();
            }
        }
    }, []);

    const toggleMute = useCallback(() => {
        const player = playerRef.current;
        if (!player) return;
        player.muted = !player.muted;
        setIsMuted(player.muted);
    }, []);

    const handleSeek = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const player = playerRef.current;
        const nextTime = Number(event.target.value);
        setCurrentTime(nextTime);
        if (player) player.currentTime = nextTime;
    }, []);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return {
        playerRef,
        currentTime,
        duration,
        progress,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        syncTime,
        togglePlay,
        toggleMute,
        handleSeek
    };
};
