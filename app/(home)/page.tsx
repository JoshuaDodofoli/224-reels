import Nav from "../components/navbar/Nav";
import HomeClient from "./(components)/HomeClient";
import { getReels } from "../utils/getReels";

export default async function Home() {
    const reels = await getReels();

    return (
        <>
            <Nav />
            <HomeClient reels={reels} />
        </>
    );
}
