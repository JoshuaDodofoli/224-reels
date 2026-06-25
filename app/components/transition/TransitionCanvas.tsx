"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useTransition, TransitionPhase } from "./TransitionContext";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const normalizePath = (href: string) => {
    try {
        return new URL(href, window.location.origin).pathname;
    } catch {
        return href.split("#")[0].split("?")[0];
    }
};

const PAGE_READY_TIMEOUT_MS = 8000;

const NoiseMaterial = shaderMaterial(
    {
        uProgress: 0,
        uTime: 0,
    },
    // vertex shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Using raw coordinates to perfectly fill the screen
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
    // fragment shader
    `
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;

    // Simplex 2D noise function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Noise calculation
      // Reduced frequency (from 5.0 to 1.5) makes the noise larger and less chaotic
      float rawNoise = snoise(vUv * 1.5 + uTime * 0.1);

      // Map noise to 0.0 -> 1.0, but reduce its contrast/intensity by 50%
      // so it feels much softer and less harsh
      float noise = rawNoise * 0.18;

      float p = uProgress;
      float alpha = 0.0;

      // Calculate dissolve effect based on progress (0 to 1 for intro, 1 to 2 for outro)
      if (p <= 1.0) {
         // Animating in (covering screen)
         float threshold = p * 1.6 - 0.3;
         alpha = smoothstep(threshold - 0.1, threshold + 0.1, noise);
         alpha = 1.0 - alpha; // Invert so it fills up
      } else {
         // Animating out (clearing screen)
         float p2 = p - 1.0;
         float threshold = p2 * 1.6 - 0.3;
         alpha = smoothstep(threshold - 0.1, threshold + 0.1, noise);
      }

      // Safety to ensure it's completely invisible when not active
      if (p == 0.0 || p == 2.0) {
         alpha = 0.0;
      }

      // The transition color (grey-200: #F5F5F5)
      vec3 color = vec3(0.96, 0.96, 0.96);

      gl_FragColor = vec4(color, alpha);
    }
  `,
);

extend({ NoiseMaterial });

const Scene = ({
    registerTrigger,
    registerIntroExit,
    setPhase,
}: {
    registerTrigger: (fn: (href: string) => void) => void;
    registerIntroExit: (fn: (onCovered?: () => void) => void) => void;
    setPhase: (phase: TransitionPhase) => void;
}) => {
    const materialRef = useRef<any>(null);
    const meshRef = useRef<any>(null);
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
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
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
                duration: 0.8,
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
                                        duration: 1.2,
                                        ease: "power2.out",
                                        onComplete: () => {
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

    return (
        <mesh ref={meshRef} frustumCulled={false} visible={false}>
            <planeGeometry args={[2, 2]} />
            {/* @ts-ignore */}
            <noiseMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
};

export const TransitionCanvas = () => {
    const { registerTrigger, registerIntroExit, setPhase } = useTransition();

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <Canvas style={{ pointerEvents: "none" }}>
                <Scene
                    registerTrigger={registerTrigger}
                    registerIntroExit={registerIntroExit}
                    setPhase={setPhase}
                />
            </Canvas>
        </div>
    );
};
