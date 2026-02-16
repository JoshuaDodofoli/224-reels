'use client'
import Wrapper from '@/app/components/Wrapper'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image'
import { useRef } from 'react';

interface reel {
    img: string;
    slug: string;
    title: string;
    desc: string;
    type: string;
}

interface SlugClientProps {
    reel: reel
}

const SlugClient = ({ reel }: SlugClientProps) => {

    const imgRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!imgRef.current) return
        if (!titleRef.current) return
        if (!descRef.current) return

        gsap.set(imgRef.current, {
            scale: 1.015,
            opacity: 0.5
        })

        gsap.to(imgRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut'
        })

        gsap.set(titleRef.current, {
            opacity: 0,
            rotateX: 40,
            y: 10
        })

        gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'power2.out',
            stagger: {
                each: 0.1
            }
        })

        gsap.set(descRef.current, {
            opacity: 0
        })

        gsap.to(descRef.current, {
            opacity: 1,
            duration: 0.6,
            delay: 0.6,
            ease: 'power2.out',
            stagger: {
                each: 0.1
            }
        })

    }, [])

    return (
        <Wrapper className="w-screen mx-auto h-dvh overflow-hidden ">
            <div className=" flex flex-col">
                <div className="w-full h-full fixed inset-0">
                    <div ref={imgRef} className="relative w-full h-full">
                        <Image
                            src={reel?.img}
                            alt={reel?.title}
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>
                <div className="flex z-20 items-center pb-6 font-sans justify-end flex-col w-full h-dvh">
                    <h1 ref={titleRef} className="text-h3 font-semibold">{reel?.title}</h1>
                    <p ref={descRef} className="text-body">{reel?.desc}</p>
                </div>
            </div>
        </Wrapper>
    )
}

export default SlugClient