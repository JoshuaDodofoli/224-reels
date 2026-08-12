import type { Metadata } from "next";
import { SITE_NAME, SOCIAL_IMAGE_PATH } from "../utils/site";

const description =
    "The story and process behind 224 Reels, a personal archive of moving images captured on iPhone.";

export const metadata: Metadata = {
    title: "About",
    description,
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: `About — ${SITE_NAME}`,
        description,
        url: "/about",
        siteName: SITE_NAME,
        type: "website",
        images: [
            {
                url: SOCIAL_IMAGE_PATH,
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `About — ${SITE_NAME}`,
        description,
        images: [SOCIAL_IMAGE_PATH],
    },
};

export default function AboutLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
