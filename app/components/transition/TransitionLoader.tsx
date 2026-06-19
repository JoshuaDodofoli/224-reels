'use client';

import { useEffect, useState } from 'react';
import { useTransition } from './TransitionContext';

// Only show the loader once we're actually waiting for the new page,
// and only if the wait lasts longer than this — prevents a flash on fast loads.
const LOADER_DELAY_MS = 200;

export const TransitionLoader = () => {
  const { phase } = useTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase === 'waiting') {
      const t = setTimeout(() => setVisible(true), LOADER_DELAY_MS);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [phase]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-60 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-px w-16 overflow-hidden bg-grey-400/30">
          <span className="transition-loader-sweep absolute inset-y-0 left-0 w-1/3 bg-grey-700" />
        </div>
        <span className="text-caption font-sans text-grey-500 uppercase">
          Loading
        </span>
      </div>
    </div>
  );
};
