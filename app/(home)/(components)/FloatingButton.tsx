'use client'

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"


interface FloatingButtonProps {
    reelTitle?: string
    next: () => void
    prev: () => void
}

const FloatingButton = ({ reelTitle, next, prev }: FloatingButtonProps) => {

    const titleRefContainer = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!titleRefContainer.current) return;
        if (!titleRef.current) return;

        gsap.to(titleRefContainer.current, {
            width: 'auto',
            duration: 0.3,
            ease: 'power2.inOut'
        })

        gsap.fromTo(titleRef.current, {
            opacity: 0,
            y: 10,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'circ.out',
            // ease: 'power2.inOut',
            // delay: 0.3
        }

        )

    }, [reelTitle])

    return (
        <div ref={titleRefContainer} className='text-background'>
            <div className="flex radius items-center justify-center gap-2 bg-grey-500/30 backdrop-blur-xl p-2 ">
                <button onClick={prev} className='radius button-style size-8 flex items-center justify-center text-body transition-[width, bg-clip-padding]'>&#11164;</button>
                <div className=' radius button-style px-4 h-8 flex overflow-hidden items-center justify-center text-body font-sans   whitespace-nowrap'>
                    <span ref={titleRef}>{reelTitle}</span>
                </div>
                <button onClick={next} className='radius button-style size-8 flex items-center justify-center text-body'>&#11166;</button>
            </div>
        </div>
    )
}

export default FloatingButton