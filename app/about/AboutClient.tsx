'use client'

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import Wrapper from '../components/Wrapper';

gsap.registerPlugin(useGSAP, SplitText);

const AboutClient = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!paraRef.current || !imageWrapRef.current || !captionRef.current) return;

    const split = new SplitText(paraRef.current, {
      type: 'lines',
      linesClass: 'about-line',
    });

    // Wrap each line in an overflow-hidden mask so the wipe is clean
    split.lines.forEach((line) => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      line.parentNode!.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Label
    tl.fromTo(
      labelRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }
    );

    // Paragraph lines wipe up
    tl.fromTo(
      split.lines,
      { yPercent: 105 },
      { yPercent: 0, duration: 0.9, stagger: 0.07 },
      '-=0.2'
    );

    // Image — McAlpine clip-path reveal + inner scale settle
    tl.fromTo(
      imageWrapRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' },
      '-=0.5'
    );
    // Inner image scales down as the mask opens — creates depth illusion
    tl.fromTo(
      imageInnerRef.current,
      { scale: 1.15 },
      { scale: 1, duration: 1.1, ease: 'power4.inOut' },
      '<' // start at same time as clip-path
    );

    // Caption
    tl.fromTo(
      captionRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    return () => split.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full min-h-dvh flex items-center justify-center py-24">
      <Wrapper>
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-10 text-grey-500">

          {/* Label */}
          <span
            ref={labelRef}
            className="font-mono text-xs text-grey-400 uppercase tracking-widest opacity-0"
          >
            224 Reels — Personal Archive
          </span>

          {/* Paragraph */}
          <div>
            <p
              ref={paraRef}
              className="text-body text-grey-450 font-sans leading-relaxed"
            >
              224 Reels is a personal archive of moving images and experiments
              created in my free time. This space exists to document and
              showcase moments, places, and the people closest to me. Some of
              these shots are polished films; others are simply fragments,
              creative tests, or ideas in motion. Ultimately, this archive grows
              alongside the work and the life that inspires it.
            </p>
          </div>

          {/* Image — outer clip-path mask + inner scale */}
          <div
            ref={imageWrapRef}
            className="relative w-full aspect-video"
            style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          >
            <div
              ref={imageInnerRef}
              className="relative w-full h-full"
              style={{ scale: '1.15' }}
            >
              <Image
                src="/about.gif"
                alt="224 Reels — personal footage"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Caption */}
          <p
            ref={captionRef}
            className="text-sm font-medium text-grey-400 font-mono opacity-0"
          >
            All captured on iPhone XR.
          </p>

        </div>
      </Wrapper>
    </section>
  );
};

export default AboutClient;
