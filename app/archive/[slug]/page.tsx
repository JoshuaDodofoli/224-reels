import { reelsData } from "@/app/utils/data";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import SlugClient from "../(components)/SlugClient";

interface SlugPageProps {
    params: Promise<{ slug: string }>
}

/** Pre-build all known reel slugs at build time. */
export function generateStaticParams() {
    return reelsData.map((reel) => ({ slug: reel.slug }));
}

/** Per-reel browser tab title and meta description. */
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const reel = reelsData.find((r) => r.slug === slug);

    if (!reel) return { title: "Not Found" };

    return {
        title: reel.title,
        description: reel.desc,
        openGraph: {
            title: reel.title,
            description: reel.desc,
            images: reel.img ? [{ url: reel.img }] : [],
        },
    };
}

const page = async ({ params }: SlugPageProps) => {
    const { slug } = await params;
    const reel = reelsData.find((r) => r.slug === slug);

    if (!reel) {
        return notFound();
    }

    return (
        <SlugClient reel={reel} />
    );
}

export default page;