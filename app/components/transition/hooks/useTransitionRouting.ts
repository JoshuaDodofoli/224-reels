import { useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { TransitionPhase } from "../TransitionContext";

const normalizePath = (href: string) => {
    try {
        return new URL(href, window.location.origin).pathname;
    } catch {
        return href.split("#")[0].split("?")[0];
    }
};

const PAGE_READY_TIMEOUT_MS = 8000;

export const useTransitionRouting = (
    registerTrigger: (fn: (href: string) => void) => void,
    registerIntroExit: (fn: (onCovered?: () => void) => void) => void,
    setPhase: (phase: TransitionPhase) => void
) => {
    const materialRef = useRef<{
        uTime: number;
        uniforms: { uProgress: { value: number } };
    } | null>(null);
    const meshRef = useRef<{ visible: boolean } | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    const pendingPathRef = useRef<string | null>(null);
    const onPageReadyRef = useRef<(() => void) | null>(null);

    // When the route commits, fire any pending "ready" callback
    useEffect(() => {
        pathnameRef.current = pathname;
        if (pendingPathRef.current && pendingPathRef.current === pathname) {
            pendingPathRef.current = null;
            const cb = onPageReadyRef.current;
            onPageReadyRef.current = null;
            cb?.();
        }
    }, [pathname]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
        }
    });

    useEffect(() => {
        registerIntroExit((onCovered?: () => void) => {
            if (!materialRef.current || !meshRef.current) {
                onCovered?.();
                return;
            }

            // Start fully covered (matches grey-200 background of intro section)
            meshRef.current.visible = true;
            materialRef.current.uniforms.uProgress.value = 1.0;

            // Let the intro section unmount now — canvas is already covering
            onCovered?.();

            // Dissolve away to reveal the site, same easing as the page transition outro
            gsap.to(materialRef.current.uniforms.uProgress, {
                value: 2.0,
                duration: 2.2,
                ease: "power2.out",
                onComplete: () => {
                    if (!materialRef.current || !meshRef.current) return;
                    materialRef.current.uniforms.uProgress.value = 0.0;
                    meshRef.current.visible = false;
                },
            });
        });

        registerTrigger((href: string) => {
            if (!materialRef.current || !meshRef.current) return;

            // Make mesh visible right before animation starts
            meshRef.current.visible = true;
            setPhase("covering");

            // Cover phase (fill screen)
            gsap.to(materialRef.current.uniforms.uProgress, {
                value: 1.0,
                duration: 2,
                ease: "power3.inOut",
                onComplete: () => {
                    const startOutro = () => {
                        setPhase("revealing");
                        // Wait two frames so the newly committed route can paint before we dissolve
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                if (!materialRef.current || !meshRef.current)
                                    return;
                                gsap.to(
                                    materialRef.current.uniforms.uProgress,
                                    {
                                        value: 2.0,
                                        duration: 3.2,
                                        ease: "power2.out",
                                        onComplete: () => {
                                            if (!materialRef.current || !meshRef.current) return;
                                            materialRef.current.uniforms.uProgress.value = 0.0;
                                            meshRef.current.visible = false;
                                            setPhase("idle");
                                        },
                                    },
                                );
                            });
                        });
                    };

                    const targetPath = normalizePath(href);
                    router.push(href);

                    if (targetPath === pathnameRef.current) {
                        // Same route — nothing to wait for
                        startOutro();
                        return;
                    }

                    // Hold the cover until the new route actually commits
                    setPhase("waiting");
                    pendingPathRef.current = targetPath;
                    onPageReadyRef.current = startOutro;

                    // Safety net — never wait forever
                    setTimeout(() => {
                        if (onPageReadyRef.current === startOutro) {
                            pendingPathRef.current = null;
                            onPageReadyRef.current = null;
                            startOutro();
                        }
                    }, PAGE_READY_TIMEOUT_MS);
                },
            });
        });
    }, [registerTrigger, registerIntroExit, router, setPhase]);

    return {
        materialRef,
        meshRef
    };
};
