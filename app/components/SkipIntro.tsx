'use client';

import { useEffect } from 'react';
import { useIntro } from '@/app/utils/context/IntroContext';

/**
 * Drop this inside any page where the intro animation should NOT play.
 * On mount it immediately marks the intro as complete so IntroAnimation
 * returns null before rendering anything.
 */
export default function SkipIntro() {
    const { setIsComplete } = useIntro();

    useEffect(() => {
        setIsComplete(true);
    }, [setIsComplete]);

    return null;
}
