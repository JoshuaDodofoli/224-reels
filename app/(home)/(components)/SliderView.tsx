'use client'

import { reelsData } from '@/app/utils/data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import Link from 'next/link';

gsap.registerPlugin(useGSAP, Observer);

export default function SliderView() {
  const reels = reelsData.slice(0, 8);
  const extendedReels = [...reels, ...reels, ...reels];
  const N = reels.length;

  const [currentIndex, setCurrentIndex] = useState(N);
  const currentIndexRef = useRef(N);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const directionRef = useRef<number>(1);
  const [displayIndex, setDisplayIndex] = useState(0);

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
            ease: 'power3.out',
            delay: inDelay,
            overwrite: true,
          });
        } else {
          gsap.to(el, {
            y: 20,
            opacity: 0,
            rotateX: 90,
            duration: 0.4,
            ease: 'power2.in',
            overwrite: true,
          });
        }
      });
    };

    animateTexts(currentIndexRef.current % N, 0.2);

    const handleScroll = (direction: number) => {
      if (isAnimating.current) return;
      directionRef.current = direction;
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
        },
      });
    };

    const obs = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
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

  // Direction-aware staged ticker animation
  useEffect(() => {
    if (!counterRef.current || !dateRef.current) return;

    const target = scrollProgress;
    const dir    = directionRef.current;
    const exitY  = dir > 0 ? '-120%' : '120%';
    const enterY = dir > 0 ?  '120%' : '-120%';

    const tl = gsap.timeline();

    // 1. Exit — slide current text out
    tl.to([counterRef.current, dateRef.current], {
      y: exitY,
      duration: 0.2,
      ease: 'power2.in',
      stagger: 0.025,
    });

    // 2. While off-screen: update content, reposition for entry
    tl.call(() => setDisplayIndex(target));
    tl.set([counterRef.current, dateRef.current], { y: enterY });

    // 3. Enter — slide new text in
    tl.to(counterRef.current, { y: '0%', duration: 0.45, ease: 'power3.out' });
    tl.to(dateRef.current,    { y: '0%', duration: 0.45, ease: 'power3.out' }, '<0.04');

  }, [scrollProgress]);

  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <div className="min-w-sm w-2/4">
        <div className="relative aspect-video overflow-hidden bg-grey-500">
          <div
            ref={containerRef}
            className="flex flex-col w-full h-full"
            style={{ willChange: 'transform' }}
          >
            {extendedReels.map((reel, idx) => (
              <Link
                key={`${reel.slug}-${idx}`}
                href={`/archive/${reel.slug}`}
                scroll={false}
                className="relative w-full flex h-full shrink-0"
              >
                <Image
                  src={reel.img}
                  alt={reel.desc}
                  fill
                  sizes="50vw"
                  className="object-center object-cover"
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                  <div
                    className="reel-text text-lg font-sans text-grey-200 font-medium flex p-2"
                    style={{ opacity: 0 }}
                  >
                    {reel.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between w-full pt-4 pb-1">
          {/* Fraction counter */}
          <div className="flex items-baseline gap-1 font-sans text-xs">
            <div className="overflow-hidden leading-none">
              <span ref={counterRef} className="inline-block">
                0{displayIndex + 1}
              </span>
            </div>
            <span className="text-grey-400">/</span>
            <span className="text-grey-400">0{N}</span>
          </div>

          {/* Date */}
          <div className="overflow-hidden leading-none">
            <span ref={dateRef} className="font-sans text-xs text-grey-400 inline-block">
              {reels[displayIndex].date}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
