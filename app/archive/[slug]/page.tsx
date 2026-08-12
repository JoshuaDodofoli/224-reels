import { getReelBySlug, getReels } from "@/app/utils/getReels";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import SlugClient from "../(components)/SlugClient";
import { SITE_NAME } from "@/app/utils/site";

interface SlugPageProps {
    params: Promise<{ slug: string }>;
}

/** Pre-build all known reel slugs at build time. */
export async function generateStaticParams() {
    const reels = await getReels();
    return reels.map((reel) => ({ slug: reel.slug }));
}

/** Per-reel browser tab title and meta description. */
export async function generateMetadata({
    params,
}: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const reel = await getReelBySlug(slug);

    if (!reel) return { title: "Not Found" };

    return {
        title: reel.title,
        description: reel.desc,
        alternates: {
            canonical: `/archive/${reel.slug}`,
        },
        openGraph: {
            title: reel.title,
            description: reel.desc,
            url: `/archive/${reel.slug}`,
            siteName: SITE_NAME,
            type: "video.other",
            images: reel.img ? [{ url: reel.img }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${reel.title} — ${SITE_NAME}`,
            description: reel.desc,
            images: reel.img ? [reel.img] : [],
        },
    };
}

const page = async ({ params }: SlugPageProps) => {
    const { slug } = await params;
    const reels = await getReels();
    const reel = reels.find((r) => r.slug === slug);

    if (!reel) {
        return notFound();
    }

    return <SlugClient reel={reel} reels={reels} />;
};

export default page;
