import type { MetadataRoute } from "next";
import { getReels } from "./utils/getReels";
import { SITE_URL } from "./utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const reels = await getReels();

    return [
        {
            url: SITE_URL,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/about`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        ...reels.map((reel) => ({
            url: `${SITE_URL}/archive/${reel.slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ];
}
