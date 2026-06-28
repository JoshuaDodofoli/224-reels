import type { Metadata } from "next";
import { Inter, Inconsolata, Oswald } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "./components/SmoothScroll";
import { ViewProvider } from "./utils/context/ViewContext";
import IntroAnimation from "./components/IntroAnimation";
import { IntroProvider } from "./utils/context/IntroContext";
import { TransitionProvider } from "./components/transition/TransitionContext";
import { ClientTransitionCanvas } from "./components/transition/ClientTransitionCanvas";
import { TransitionLoader } from "./components/transition/TransitionLoader";

const montreal = localFont({
    src: "../app/fonts/NeueMontreal.woff2",
    variable: "--montreal",
});

const clashGrotesk = localFont({
    src: "../app/fonts/ClashGrotesk-Variable.woff2",
    variable: "--clash-grotesk",
});

const inconsolata = Inconsolata({
    variable: "--font-inconsolata",
    subsets: ["latin"],
});

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://224reels.com"),
    title: {
        default: "224 Reels",
        template: "%s — 224 Reels",
    },
    description:
        "A personal archive of moving images and experiments — moments, places, and the people closest to me.",
    openGraph: {
        siteName: "224 Reels",
        type: "website",
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
                className={`${inconsolata.variable} ${inter.variable} ${montreal.variable} ${clashGrotesk.variable} ${oswald.variable} antialiased`}
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
                    </TransitionProvider>
                </ViewProvider>
            </body>
        </html>
    );
}
