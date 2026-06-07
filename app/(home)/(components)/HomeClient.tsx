'use client'
import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const reels = reelsData.slice(0, 6);
  const extendedReels = [...reels, ...reels, ...reels]; // 3x array for infinite scroll
  const N = reels.length;

  const [currentIndex, setCurrentIndex] = useState(N); // Start at the middle block
  const [isJumping, setIsJumping] = useState(false);

  const lastScrollTime = useRef(0);

  useEffect(() => {
    let accumulated = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      // 600ms cooldown to ignore the "tail" of trackpad inertial momentum
      if (now - lastScrollTime.current < 300) {
        accumulated = 0;
        return;
      }

      // Prioritize deltaX for horizontal scrolling, fallback to deltaY
      accumulated += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Require a deliberate swipe to trigger a slide change (reduces sensitivity)
        if (Math.abs(accumulated) < 80 || isJumping) {
          accumulated = 0;
          return;
        }

        const direction = accumulated > 0 ? 1 : -1;
        setCurrentIndex(prev => prev + direction);
        accumulated = 0;
        lastScrollTime.current = Date.now();
      }, 30);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isJumping]);

  // Turn isJumping back to false after the invisible CSS jump renders
  useEffect(() => {
    if (isJumping) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsJumping(false);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isJumping]);

  // Derived state for UI
  const scrollProgress = currentIndex % N;
  const activeIndex = scrollProgress;

  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <div className="min-w-sm w-2/4">
        {/* Stationary rectangle, hides the rest of the image column */}
        <div className="relative aspect-video overflow-hidden bg-black">
          {/* One long column moving up and down */}
          <div
            className="flex flex-col w-full h-full"
            style={{
              transform: `translateY(-${currentIndex * 100}%)`,
              transition: isJumping ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform'
            }}
            onTransitionEnd={() => {
              // Invisible jump to the center block once transition finishes
              if (currentIndex >= 2 * N) {
                setIsJumping(true);
                setCurrentIndex(currentIndex - N);
              } else if (currentIndex < N) {
                setIsJumping(true);
                setCurrentIndex(currentIndex + N);
              }
            }}
          >
            {extendedReels.map((reel, idx) => (
              <div key={`${reel.slug}-${idx}`} className="relative w-full h-full shrink-0">
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
          <div className="flex justify-between items-start h-1">
            {[...Array(50)].map((_, id) => {
              const centerIndex = (scrollProgress / (reels.length - 1)) * 49;
              const distance = Math.abs(id - centerIndex);

              let styles = 'h-1 bg-black/30';
              if (distance < 1.5) styles = 'h-3 bg-black';
              else if (distance < 3.5) styles = 'h-2 bg-black/60';
              else if (distance < 6.5) styles = 'h-1 bg-black/40';

              return (
                <span
                  key={id}
                  // Increased duration so the wave animates smoothly in sync with the slide transition
                  className={`w-px rounded-full transition-all duration-500 ease-out ${styles}`}
                />
              );
            })}
          </div>

          {/* Slide numbers */}
          <ul className="flex justify-between">
            {reels.map((_, idx) => (
              <li
                key={idx}
                className={`font-mono font-medium text-xs md:text-sm transition-opacity duration-300 ${idx === activeIndex ? 'opacity-100' : 'opacity-30'
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