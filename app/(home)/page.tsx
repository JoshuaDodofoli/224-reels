import Nav from "../components/navbar/Nav";
import HomeClient from "./(components)/HomeClient";

export default async function Home() {
    // const videos = await getMuxVideos();
    // console.log(videos.data[2].duration);

    return (
        <>
            <Nav />
            <HomeClient
            //  videos={videos.data}
            />
        </>
    );
}
