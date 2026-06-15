'use client'

import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

export default function ListView() {
  const reels = reelsData.slice(0, 8);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <section className="w-full mx-auto min-h-dvh pt-20 pb-16 relative">
      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-40 w-48 aspect-video overflow-hidden transition-opacity duration-300"
        style={{ opacity: hoveredIndex !== null ? 1 : 0 }}
      >
        {hoveredIndex !== null && (
          <Image
            src={reels[hoveredIndex].img}
            alt={reels[hoveredIndex].title}
            fill
            sizes="192px"
            className="object-cover object-center"
          />
        )}
      </div>

      <div className="max-w-380 mx-auto px-4">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-1">
          <span className="font-mono text-xs text-grey-400 uppercase tracking-widest">Index</span>
          <span className="font-mono text-xs text-grey-400 uppercase tracking-widest flex-1 pl-8">Title</span>
          <span className="font-mono text-xs text-grey-400 uppercase tracking-widest hidden md:block">Type</span>
          <span className="font-mono text-xs text-grey-400 uppercase tracking-widest w-28 text-right hidden md:block">Date</span>
        </div>

        <ul>
          {reels.map((reel, idx) => (
            <li key={reel.slug} className="border-b border-black/10 last:border-none">
              <Link
                href={`/archive/${reel.slug}`}
                ref={(el) => { rowRefs.current[idx] = el; }}
                className="group flex items-center justify-between py-4 gap-4 opacity-0"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="font-mono text-xs text-grey-400 w-8 shrink-0">
                  0{idx + 1}
                </span>
                <span className="font-sans text-grey-500 text-sm md:text-base flex-1 group-hover:translate-x-1 transition-transform duration-300 ease-out">
                  {reel.title}
                </span>

                <span className="hidden md:inline-flex font-mono text-xs text-grey-400 uppercase tracking-widest border border-grey-300 px-2 py-0.5 shrink-0">
                  {reel.type}
                </span>
                <span className="hidden md:block font-mono text-xs text-grey-400 w-28 text-right shrink-0">
                  {reel.date}
                </span>
                <span className="font-sans text-grey-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
