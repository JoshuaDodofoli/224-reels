'use client'
import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const reels = reelsData.slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let accumulated = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const container = scrollRef.current;
    if (!container) return;

    accumulated += e.deltaY;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      const slideHeight = container.clientHeight;
      const currentIndex = Math.round(container.scrollTop / slideHeight);
      const direction = accumulated > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), reels.length - 1);

      container.scrollTo({ top: nextIndex * slideHeight, behavior: 'smooth' });
      accumulated = 0;
    }, 50);
  };

    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      const index = Math.round(container.scrollTop / container.clientHeight);
      setActiveIndex(index);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    scrollRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      scrollRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <div className="min-w-sm w-2/4">
        <div className="relative aspect-video">
          <div
            ref={scrollRef}
            className="absolute inset-0 flex flex-col overflow-y-auto snap-y snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reels.map((reel) => (
              <div key={reel.slug} className="relative w-full h-full snap-center shrink-0">
                <Image
                  src={reel.img}
                  alt={reel.desc}
                  fill
                  className="object-center object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full py-3 gap-5">
          <div className="flex justify-between items-center">
            {[...Array(50)].map((_, id) => {
              const filled = id < Math.round((activeIndex / (reels.length - 1)) * 50);
              return (
                <span
                  key={id}
                  className={`w-px h-1.5 transition-colors duration-300 ${filled ? 'bg-black' : 'bg-black/20'}`}
                />
              );
            })}
          </div>

          {/* Slide numbers */}
          <ul className="flex justify-between">
            {reels.map((_, idx) => (
              <li
                key={idx}
                className={`font-mono font-medium text-xs md:text-sm transition-opacity duration-300 ${
                  idx === activeIndex ? 'opacity-100' : 'opacity-30'
                }`}
              >
                0{idx + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}