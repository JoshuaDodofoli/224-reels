import Nav from "../components/navbar/Nav";
import HomeClient from "./(components)/HomeClient";
import { getReels } from "../utils/getReels";
import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
    },
};

export default async function Home() {
    const reels = await getReels();

    return (
        <>
            <Nav />
            <HomeClient reels={reels} />
        </>
    );
}
