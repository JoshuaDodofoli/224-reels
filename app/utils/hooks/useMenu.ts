import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";

interface UseMenuProps {
    menuRef: RefObject<HTMLDivElement | null>;
    toggleMenu: boolean;
}

export const useMenu = ({menuRef,toggleMenu}: UseMenuProps) => {
    useGSAP(() => {
        if (toggleMenu) {
            const tl = gsap.timeline();
            
            tl.fromTo(menuRef.current, {
                width: 0,
                height: 0,
            },{
                width: 170,
                height: "auto",
                duration: 0.6,
                ease: "power3.inOut"
            })
            
            tl.fromTo('.menu-text', {
                y: 10,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.3")
            
            tl.to('.menu-line', {
                width: "100%",
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.inOut"
            }, "-=0.3")
            
            tl.to('.menu-views', {
                opacity: 1,
                duration: 0.6,
                ease: "power2.inOut"
            }, "-=0.3")
            
        } else {
            const tl = gsap.timeline();
            
            tl.to(['.menu-text', '.menu-views'], {
                opacity: 0,
                duration: 0.3
            })
            tl.to('.menu-line', {
                width: 0,
                duration: 0.4,
                stagger: 0.1,
            }, "<")
            
            tl.to(menuRef.current, {
                width: 0,
                height: 0,
                duration: 0.6,
                ease: "power3.inOut"
            }, "-=0.1")
        }

    }, { dependencies: [toggleMenu], scope: menuRef })
}