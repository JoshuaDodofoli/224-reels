import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { RefObject } from 'react';

gsap.registerPlugin(useGSAP, SplitText);

interface UseAboutAnimeProps {
  sectionRef: RefObject<HTMLElement | null>;
  labelRef: RefObject<HTMLElement | null>;
  paraRef: RefObject<HTMLElement | null>;
  imageWrapRef: RefObject<HTMLElement | null>;
  imageInnerRef: RefObject<HTMLElement | null>;
  captionRef: RefObject<HTMLElement | null>;
}

export const useAboutAnime = ({
  sectionRef,
  labelRef,
  paraRef,
  imageWrapRef,
  imageInnerRef,
  captionRef,
}: UseAboutAnimeProps) => {
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

    // Label fade up
    tl.fromTo(
      labelRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }
    );

    // Paragraph — line-by-line wipe up
    tl.fromTo(
      split.lines,
      { yPercent: 105 },
      { yPercent: 0, duration: 0.9, stagger: 0.07 },
      '-=0.2'
    );

    // Image outer — clip-path reveals from bottom (McAlpine style)
    tl.fromTo(
      imageWrapRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' },
      '-=0.5'
    );

    // Image inner — scale settles simultaneously, creating depth illusion
    tl.fromTo(
      imageInnerRef.current,
      { scale: 1.15 },
      { scale: 1, duration: 1.1, ease: 'power4.inOut' },
      '<'
    );

    // Caption fade up
    tl.fromTo(
      captionRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    return () => split.revert();
  }, { scope: sectionRef });
};
