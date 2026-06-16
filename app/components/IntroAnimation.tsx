'use client'

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function IntroAnimation({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const [done, setDone] = useState(false);

  const brand = '224 REELS';

  useGSAP(() => {
    const chars = charsRef.current.filter(Boolean);
    if (!chars.length) return;

    gsap.set(chars, { yPercent: 110 });
    gsap.set(lineRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });

    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(obj.val)
            .toString()
            .padStart(3, '0');
        }
      },
    }, 0);

    tl.to(
      lineRef.current,
      { scaleX: 1, duration: 1.6, ease: 'power2.inOut' },
      0
    );

    tl.to(
      chars,
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.04,
        opacity: 1
      },
      0.2
    );

    tl.addLabel('split', '+=0.35');

    tl.to(topPanelRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
    }, 'split');

    tl.to(bottomPanelRef.current, {
      yPercent: 100,
      duration: 1,
      ease: 'power4.inOut',
    }, 'split');

    tl.to(logoRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 'split');

  }, { scope: containerRef });

  if (done) return null;

  return (
    <div
      ref={containerRef}
      className="intro-overlay"
      aria-hidden="true"
    >
      <div ref={topPanelRef} className="intro-panel intro-panel--top" />
      <div ref={bottomPanelRef} className="intro-panel intro-panel--bottom" />

      <div ref={logoRef} className="intro-content">
        <div className="intro-brand">
          {brand.split('').map((char, i) => (
            <span key={i} className="intro-char-wrapper">
              <span
                ref={(el) => { if (el) charsRef.current[i] = el; }}
                className="intro-char"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </div>

        <div className="intro-meta">
          <div ref={lineRef} className="intro-line" />
          <span ref={counterRef} className="intro-counter">000</span>
        </div>
      </div>
    </div>
  );
}
