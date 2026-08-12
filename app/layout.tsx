import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "./components/SmoothScroll";
import { ViewProvider } from "./utils/context/ViewContext";
import IntroAnimation from "./components/IntroAnimation";
import { IntroProvider } from "./utils/context/IntroContext";
import { TransitionProvider } from "./components/transition/TransitionContext";
import { ClientTransitionCanvas } from "./components/transition/ClientTransitionCanvas";
import { TransitionLoader } from "./components/transition/TransitionLoader";
import Noise from "./components/Noise";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
    SOCIAL_IMAGE_PATH,
} from "./utils/site";

const montreal = localFont({
    src: "../app/fonts/NeueMontreal.woff2",
    variable: "--montreal",
});

const clashGrotesk = localFont({
    src: "../app/fonts/ClashGrotesk-Variable.woff2",
    variable: "--clash-grotesk",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: "/",
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
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [SOCIAL_IMAGE_PATH],
    },
};

export default function RootLayout({
    children,
    // modal
}: Readonly<{
    children: React.ReactNode;
    // modal: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${montreal.variable} ${clashGrotesk.variable} antialiased`}
            >
                <ViewProvider>
                    <TransitionProvider>
                        <SmoothScroll>
                            <IntroProvider>
                                <IntroAnimation />
                                {/* {modal} */}
                                {children}
                            </IntroProvider>
                        </SmoothScroll>
                        <ClientTransitionCanvas />
                        <TransitionLoader />
                        <Noise />
                    </TransitionProvider>
                </ViewProvider>
            </body>
        </html>
    );
}
