"use client";

import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useTransition, TransitionPhase } from "./TransitionContext";
import { NoiseMaterial } from "./NoiseShaderMaterial";
import { useTransitionRouting } from "./hooks/useTransitionRouting";

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
    const { materialRef, meshRef } = useTransitionRouting(registerTrigger, registerIntroExit, setPhase);

    return (
        <mesh ref={meshRef} frustumCulled={false} visible={false}>
            <planeGeometry args={[2, 2]} />
            {/* @ts-expect-error — custom shaderMaterial registered via extend */}
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
