'use client'
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VideoAsset } from "@/app/utils/types";
import BackgroundVideo from "next-video/background-video";

interface HomeClientProps {
    videos: VideoAsset[]
}

export default function Home({ videos }: HomeClientProps) {
    const [currentReel, setCurrentReel] = useState<number>(0);

    useEffect(() => {
        if (videos.length === 0) return;
        const interval = setInterval(() => {
            setCurrentReel((prev: number) => (prev + 1) % videos.length)
        }, 5000);
        return () => clearInterval(interval);
    }, [videos.length]);

    if (videos.length === 0) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">No videos found</div>;
    }

    const activeVideo = videos[currentReel];
    const playbackId = activeVideo?.playback_ids?.[0]?.id;
    const currentTitle = activeVideo.meta?.title || "Untitled Reel";

    if (!playbackId) {
        return <div className="h-screen bg-black" />;
    }

    return (
        <section className="w-full h-screen fixed inset-0 bg-black">
            <div className="relative w-full h-full">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={playbackId}
                        initial={{ opacity: 0.3, transition: { duration: 0.8, ease: 'easeInOut' } }}
                        animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeInOut' } }}
                        exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
                        className="absolute inset-0"
                    >
                        <BackgroundVideo
                            src={`https://stream.mux.com/${playbackId!}.m3u8`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <div className="overflow-hidden py-2" key={`wrap-${activeVideo.id!}`}>
                            <motion.p
                                key={`text-${activeVideo.id}`}
                                className="px-4 text-center leading-tight font-semibold hero-title uppercase text-white text-5xl md:text-7xl"
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ 
                                    y: 0, 
                                    opacity: 1,
                                    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                                }}
                                exit={{ 
                                    y: "-100%", 
                                    opacity: 0,
                                    transition: { duration: 0.4 }
                                }}
                            >
                                {currentTitle}
                            </motion.p>
                        </div>
                    </AnimatePresence>
                </div>
            </div>

            {/* </div> */}
        </section>
    );
}