'use client'

import Image from 'next/image';
import { useRef } from 'react';
import Nav from '../components/navbar/Nav';
import Wrapper from '../components/Wrapper';
import { useAboutAnime } from '../utils/hooks/useAboutAnime';

const AboutPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useAboutAnime({ sectionRef, labelRef, paraRef, imageWrapRef, imageInnerRef, captionRef });

  return (
    <>
      <Nav />
      <section
        ref={sectionRef}
        className="w-full min-h-dvh flex items-center justify-center py-24 relative overflow-hidden"
      >
        <Wrapper>
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-10 text-grey-500">

            {/* Label */}
            {/* <span
              ref={labelRef}
              className="font-mono text-xs text-grey-400 uppercase tracking-widest opacity-0"
            >
              224 Reels — Personal Archive
            </span> */}

            {/* Paragraph */}
            <div>
              <p
                ref={paraRef}
                className="text-body text-grey-450 font-sans leading-relaxed"
              >
                224 Reels is a personal archive of moving images and experiments
                created in my free time. This space exists to document and
                showcase moments, places, and the people closest to me. These shots aren&apos;t polished. Ultimately, this archive grows
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
                  unoptimized
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
    </>
  );
};

export default AboutPage;