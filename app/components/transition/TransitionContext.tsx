'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export type TransitionPhase = 'idle' | 'covering' | 'waiting' | 'revealing';

interface TransitionContextType {
  transitionTo: (href: string) => void;
  registerTrigger: (fn: (href: string) => void) => void;
  runIntroExit: (onCovered?: () => void) => void;
  registerIntroExit: (fn: (onCovered?: () => void) => void) => void;
  phase: TransitionPhase;
  setPhase: (phase: TransitionPhase) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const triggerRef = useRef<((href: string) => void) | null>(null);
  const introExitRef = useRef<((onCovered?: () => void) => void) | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const registerTrigger = useCallback((fn: (href: string) => void) => {
    triggerRef.current = fn;
  }, []);

  const registerIntroExit = useCallback((fn: (onCovered?: () => void) => void) => {
    introExitRef.current = fn;
  }, []);

  const transitionTo = useCallback((href: string) => {
    if (triggerRef.current) {
      triggerRef.current(href);
    } else {
      router.push(href);
    }
  }, [router]);

  const runIntroExit = useCallback((onCovered?: () => void) => {
    if (introExitRef.current) {
      introExitRef.current(onCovered);
    } else {
      onCovered?.();
    }
  }, []);

  return (
    <TransitionContext.Provider
      value={{ transitionTo, registerTrigger, runIntroExit, registerIntroExit, phase, setPhase }}
    >
      {children}
    </TransitionContext.Provider>
  );
};
