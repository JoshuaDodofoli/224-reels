import Link from 'next/link';
import SkipIntro from '@/app/components/SkipIntro';

export default function NotFound() {
    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center bg-grey-700 text-grey-200 px-8 text-center gap-8">
            <SkipIntro />

            {/* Number + divider + label */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-[clamp(4rem,15vw,8rem)] font-sans font-bold tracking-tight leading-none text-grey-200">
                    404
                </span>
                <span className="block h-px w-full bg-grey-200/20 my-2" />
                <span className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-grey-400">
                    Page not found
                </span>
            </div>

            {/* Body copy */}
            <p className="max-w-sm text-grey-400 text-body font-sans leading-relaxed">
                This frame doesn&apos;t exist in the archive. It may have moved,
                been removed, or never existed at all.
            </p>

            {/* CTA */}
            <Link
                href="/"
                className="inline-block bg-grey-200 text-grey-700 px-5 py-2 text-[0.8rem] font-sans font-medium uppercase tracking-widest hover:opacity-80 transition-opacity duration-200"
            >
                Back to Archive
            </Link>

            {/* Branding watermark */}
            <span className="absolute bottom-6 font-mono text-[0.65rem] text-grey-500 tracking-[0.25em] uppercase">
                224 Reels
            </span>
        </main>
    );
}
