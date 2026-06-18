'use client'

import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TransitionLink } from '@/app/components/transition/TransitionLink';

export default function ListView() {
  const reels = reelsData.slice(0, 8);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredIndex !== null) {
      setActiveImage(reels[hoveredIndex].img);
    }
  }, [hoveredIndex, reels]);

  useGSAP(() => {
    gsap.fromTo(
      rowRefs.current,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }, []);

  useGSAP(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (hoveredIndex !== null) {
      gsap.to(preview, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      });
    } else {
      gsap.to(preview, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const onMove = (e: MouseEvent) => {
      gsap.to(preview, {
        x: e.clientX + 20,
        y: e.clientY - 60,
        duration: 0.35,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="w-full mx-auto min-h-dvh pt-28">
      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-40 w-48 aspect-video overflow-hidden"
        style={{ opacity: 0, transform: 'scale(0.5)' }}
      >
        {activeImage && (
          <Image
            src={activeImage}
            alt="Preview"
            fill
            sizes="192px"
            className="object-cover object-center"
          />
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between border-b border-grey-300 pb-3 mb-1">
          <span className="font-sans text-xs text-grey-400 uppercase tracking-widest">Index</span>
          <span className="font-sans text-xs text-grey-400 uppercase tracking-widest flex-1 pl-8">Title</span>
          {/* <span className="font-sans text-xs text-grey-400 uppercase tracking-widest">Type</span> */}
          <span className="font-sans text-xs text-grey-400 uppercase tracking-widest  text-right">Date</span>
        </div>

        <ul>
          {reels.map((reel, idx) => (
            <li key={reel.slug} className="border-b border-grey-300">
              <TransitionLink
                href={`/archive/${reel.slug}`}
                ref={(el: any) => { rowRefs.current[idx] = el; }}
                className="group relative flex items-center justify-between py-4 gap-4 opacity-0"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="relative z-10 font-sans text-xs text-grey-400 w-8 shrink-0 group-hover:text-white transition-colors duration-300">
                  0{idx + 1}
                </span>
                <span className="relative z-10 font-sans text-grey-500 text-sm md:text-base flex-1 group-hover:translate-x-2 group-hover:text-white transition-all duration-500 ease-out">
                  {reel.title}
                </span>

                <span className="relative z-10 font-sans text-xs text-grey-400 w-28 text-right shrink-0 group-hover:text-white group-hover:-translate-x-2 transition-all duration-500 ease-in-out">
                  {reel.date}
                </span>
                {/* <span className="font-sans text-grey-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                  →
                </span> */}
                <div className="absolute -inset-x-2 inset-y-0 bg-grey-500 origin-bottom scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100 z-0 pointer-events-none" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
