'use client'
import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from "gsap/Observer";
import Link from 'next/link';

gsap.registerPlugin(useGSAP, Observer);

export default function Home() {
  const reels = reelsData.slice(0, 8);
  const extendedReels = [...reels, ...reels, ...reels];
  const N = reels.length;

  const [currentIndex, setCurrentIndex] = useState(N);
  const currentIndexRef = useRef(N);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useGSAP(() => {
    gsap.set(containerRef.current, { yPercent: -currentIndexRef.current * 100 });

    const texts = gsap.utils.toArray('.reel-text');

    gsap.set(texts, { y: 20, opacity: 0, rotateX: 90, transformOrigin: 'center center' });

    const animateTexts = (activeIdx: number, inDelay: number = 0.6) => {
      texts.forEach((el: any, idx: number) => {
        const isActive = idx % N === activeIdx;

        if (isActive) {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: inDelay,
            overwrite: true
          });
        } else {
          gsap.to(el, {
            y: 20,
            opacity: 0,
            rotateX: 90,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true
          });
        }
      });
    };

    animateTexts(currentIndexRef.current % N, 0.2);

    const handleScroll = (direction: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const nextIndex = currentIndexRef.current + direction;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      animateTexts(nextIndex % N, 0.65);

      gsap.to(containerRef.current, {
        yPercent: -nextIndex * 100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          let finalIndex = nextIndex;
          let didJump = false;

          if (nextIndex >= 2 * N) {
            finalIndex = nextIndex - N;
            didJump = true;
          } else if (nextIndex < N) {
            finalIndex = nextIndex + N;
            didJump = true;
          }

          if (didJump) {
            gsap.set(containerRef.current, { yPercent: -finalIndex * 100 });
            currentIndexRef.current = finalIndex;
            setCurrentIndex(finalIndex);
          }

          isAnimating.current = false;
        }
      });
    };

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      preventDefault: true,
      tolerance: 40,
      onUp: () => handleScroll(1),
      onDown: () => handleScroll(-1),
      onLeft: () => handleScroll(-1),
      onRight: () => handleScroll(1),
    });

    return () => obs.kill();
  }, { scope: containerRef });

  const scrollProgress = currentIndex % N;
  const activeIndex = scrollProgress;

  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <div className="min-w-sm w-2/4">
        <div className="relative aspect-video overflow-hidden bg-black">
          <div
            ref={containerRef}
            className="flex flex-col w-full h-full"
            style={{ willChange: 'transform' }}
          >
            {extendedReels.map((reel, idx) => {
              return (
                <Link key={`${reel.slug}-${idx}`} href={`/archive/${reel.slug}`} scroll={false} className="relative w-full flex h-full shrink-0">
                  <Image
                    src={reel.img}
                    alt={reel.desc}
                    fill
                    sizes="50vw"
                    className="object-center object-cover"
                  />
                  <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center z-10"
                    // style={{ perspective: "800px" }}
                  >
                    <div
                      className="reel-text text-lg font-sans text-white font-medium flex p-2"
                      style={{ opacity: 0 }}
                    >
                      {reel.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-full py-3 gap-5">
          <div className="flex justify-between items-start h-1">
            {[...Array(50)].map((_, id) => {
              const centerIndex = (scrollProgress / (reels.length - 1)) * 49;
              const distance = Math.abs(id - centerIndex);

              let styles = 'h-1 bg-black/30';
              if (distance < 1.5) styles = 'h-3 bg-black/70';
              else if (distance < 3.5) styles = 'h-2 bg-black/60';
              else if (distance < 6.5) styles = 'h-1 bg-black/40';

              return (
                <span
                  key={id}
                  className={`w-px rounded-full transition-all duration-500 ease-out ${styles}`}
                />
              );
            })}
          </div>

          <ul className="flex justify-between">
            {reels.map((_, idx) => (
              <li
                key={idx}
                className={`font-mono font-medium text-xs md:text-sm transition-opacity duration-300 ${idx === activeIndex ? 'opacity-70' : 'opacity-30'
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