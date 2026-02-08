'use client'
import { reelsData } from "@/app/utils/data"
import Card from "./Card"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface WorkProps {
    selected: number
}

const Work = ({ selected }: WorkProps) => {
    
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredReels = reelsData.filter((reel) => {
        if (selected === 0) return true;
        if (selected === 1) return reel.type === "reel";
        if (selected === 2) return reel.type === "snippet";
        return true;
    });

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.fromTo(containerRef.current.children, {
            opacity: 0,
            y: 20,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: {
                each: 0.1,
                from: 'start'
            }
        })
    }, [selected]) // Re-animate when filter changes

    return (
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full h-full">
            {filteredReels.length > 0 ? (
                filteredReels.map((reel, idx) => (
                    <Card key={reel.slug || idx} reel={reel} />
                ))
            ) : (
                <p className="text-grey-400 col-span-2 text-center py-12">
                    No items found
                </p>
            )}
        </div>
    )
}

export default Work