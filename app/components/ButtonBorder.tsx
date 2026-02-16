'use client'
import { useGSAP } from "@gsap/react"
import classNames from "classnames"
import gsap from "gsap"
import { useRef } from "react"

interface props {
    children: React.ReactNode
    className?: string
}

const ButtonBorder = ({ children, className }: props) => {

  const bgRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bgRef.current || !containerRef.current) return;

    gsap.set(bgRef.current, {
      height: 0
    })

    const tl = gsap.timeline({ paused: true })
      .to(bgRef.current, {
        height: "100%",
        duration: 0.4,
        ease: 'power4.inOut'
      })

    const container = containerRef.current;
    
    container.addEventListener('mouseenter', () => tl.play());
    container.addEventListener('mouseleave', () => tl.reverse());

    return () => {
      container.removeEventListener('mouseenter', () => tl.play());
      container.removeEventListener('mouseleave', () => tl.reverse());
    }

  }, [])

  return (
    <div ref={containerRef} className={classNames(className, "relative block")}>
      <span ref={bgRef} className="absolute bottom-0 left-0 w-full bg-background/30 -z-10" />
      {children}
      <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌜</span>
      <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌝</span>
      <span className="absolute bottom-0 left-0 -translate-x-1 translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌞</span>
      <span className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌟</span>
    </div>
  )
}

export default ButtonBorder