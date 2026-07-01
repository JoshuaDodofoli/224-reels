'use client'

import { createContext, useContext, useState } from 'react';

type View = 'slider' | 'list';

interface ViewContextType {
    view: View;
    setView: (view: View) => void;
}

const ViewContext = createContext<ViewContextType | null>(null);

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [view, setView] = useState<View>('slider');

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {children}
        </ViewContext.Provider>
    );
};

export const useView = () => {
    const ctx = useContext(ViewContext);
    if (!ctx) throw new Error('useView must be used inside ViewProvider');
    return ctx;
};
