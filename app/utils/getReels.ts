import { wixCient } from "./wixClient";
import { reelsData, Reel } from "./data";

export const createTitleSlug = (title: string) =>
    title
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const mockReels = reelsData.map((reel) => ({
    ...reel,
    slug: createTitleSlug(reel.title) || reel.slug,
}));

const mockBySlug = Object.fromEntries([
    ...reelsData.map((reel, index) => [reel.slug, mockReels[index]]),
    ...mockReels.map((reel) => [reel.slug, reel]),
]);

const stringField = (value: unknown) =>
    typeof value === "string" && value.trim() ? value.trim() : undefined;

const getField = (item: Record<string, unknown>, key: string) => {
    const direct = item[key];
    if (direct !== undefined) return direct;

    const matchingKey = Object.keys(item).find(
        (itemKey) => itemKey.toLowerCase() === key.toLowerCase(),
    );

    return matchingKey ? item[matchingKey] : undefined;
};

const getItemData = (item: Record<string, unknown>) => {
    if (item.data && typeof item.data === "object") {
        return item.data as Record<string, unknown>;
    }

    const hasFields = [
        "slug",
        "title",
        "description",
        "thumbnail",
        "muxPlaybackId",
    ].some((key) => getField(item, key) !== undefined);

    return hasFields ? item : null;
};

/**
 * Maps a raw Wix CMS data item to the app's Reel shape.
 * Any non-video field missing from Wix falls back to the matching mock reel in data.ts.
 */
function mapItemToReel(item: Record<string, unknown>, index = 0): Reel {
    const wixSlug = stringField(getField(item, "slug")) ?? "";
    const mock = mockBySlug[wixSlug] ?? mockReels[index];
    const title = stringField(getField(item, "title")) ?? mock?.title ?? "";

    return {
        slug: createTitleSlug(title) || wixSlug || mock?.slug || "",
        title,
        desc: stringField(getField(item, "description")) ?? mock?.desc ?? "",
        type: stringField(getField(item, "type")) ?? mock?.type ?? "",
        date: stringField(getField(item, "date")) ?? mock?.date ?? "",
        img: stringField(getField(item, "thumbnail")) ?? mock?.img ?? "",
        video: stringField(getField(item, "muxPlaybackId")),
    };
}

/**
 * Fetch all reels from Wix CMS, sorted by date descending.
 * Safe to call from any Server Component or API route.
 * Results are not cached — wrap with Next.js `cache()` or use
 * `fetch` revalidation if you want ISR behaviour.
 */
export async function getReels(): Promise<Reel[]> {
    try {
        const result = await wixCient.items
            .query("reels")
            // .descending("date")
            .find();

        const reels = result.items
            .map((item) => getItemData(item as Record<string, unknown>))
            .filter((item): item is Record<string, unknown> => item != null)
            .map((item, index) => mapItemToReel(item, index))
            .filter((reel) => reel.slug); // drop any rows missing a slug

        if (
            process.env.NODE_ENV === "development" &&
            reels.length > 0 &&
            reels.every((reel) => !reel.video)
        ) {
            console.warn(
                "No muxPlaybackId values were returned from Wix reels data.",
            );
        }

        return reels.length ? reels : mockReels;
    } catch (error) {
        console.error("Failed to fetch reels from Wix", error);
        return mockReels;
    }
}

/**
 * Fetch a single reel by slug.
 * Returns undefined if not found.
 */
export async function getReelBySlug(slug: string): Promise<Reel | undefined> {
    const reels = await getReels();
    return reels.find((reel) => reel.slug === slug);
}
