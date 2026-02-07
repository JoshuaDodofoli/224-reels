'use client'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { useRef } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

interface ReelProps {
    img: string
    slug?: string
    title: string
    desc?: string
    type?: string
}

interface CardProps {
    reel: ReelProps
}

const Card = ({ reel }: CardProps) => {

    const { img, slug, title, desc, type } = reel;
    const imgContainer = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!imgContainer.current || !imgRef.current) return;

        gsap.fromTo(imgRef.current, {
            yPercent: -10,
        }, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: imgContainer.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
        })

    }, [])

    return (
        <Link href={`/works/${slug}`} className="relative w-full">
            <div className="w-full flex items-start flex-col mb-14 lg:mb-24">
                <div ref={imgContainer} className="relative aspect-16/10 w-full overflow-hidden">
                    <div ref={imgRef} className="w-full h-[120%] relative">
                        <Image
                            src={img}
                            alt={title}
                            fill
                            className="object-center object-cover"
                        />
                    </div>
                </div>
                <div className="max-w-sm w-full pt-1 text-background">
                    <h3 className="font-semibold text-h3">{title}</h3>
                    <p className="text-body -mt-1 md:-mt-2">{desc}</p>
                </div>
            </div>
        </Link>
    )
}

export default Card