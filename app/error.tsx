'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SkipIntro from '@/app/components/SkipIntro';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error('[224 Reels] Unhandled error:', error);
    }, [error]);

    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center bg-grey-700 text-grey-200 px-8 text-center gap-8">
            <SkipIntro />

            {/* Heading + divider + label */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-[clamp(3rem,12vw,6rem)] font-sans font-bold tracking-tight leading-none text-grey-200">
                    Error
                </span>
                <span className="block h-px w-full bg-grey-200/20 my-2" />
                <span className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-grey-400">
                    Something went wrong
                </span>
            </div>

            {/* Body copy */}
            <p className="max-w-sm text-grey-400 text-body font-sans leading-relaxed">
                An unexpected error occurred. You can try again or return to the archive.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={reset}
                    className="bg-grey-200 text-grey-700 px-5 py-2 text-[0.8rem] font-sans font-medium uppercase tracking-widest hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="border border-grey-200/20 text-grey-400 px-5 py-2 text-[0.8rem] font-sans font-medium uppercase tracking-widest hover:text-grey-200 transition-colors duration-200"
                >
                    Back to Archive
                </Link>
            </div>

            {/* Branding watermark */}
            <span className="absolute bottom-6 font-mono text-[0.65rem] text-grey-500 tracking-[0.25em] uppercase">
                224 Reels
            </span>
        </main>
    );
}
