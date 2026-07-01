'use client'

import { createContext, useContext, useState } from 'react';

type IntroContextType = {
    isComplete: boolean;
    setIsComplete: (isComplete: boolean) => void;
};

const IntroContext = createContext<IntroContextType | null>(null);

export const IntroProvider = ({ children }: { children: React.ReactNode }) => {
    const [isComplete, setIsComplete] = useState(false);

    return (
        <IntroContext.Provider value={{ isComplete, setIsComplete }}>
            {children}
        </IntroContext.Provider>
    );
};

export const useIntro = () => {
    const ctx = useContext(IntroContext);
    if (!ctx) throw new Error('useIntro must be used inside IntroProvider');
    return ctx;
};
