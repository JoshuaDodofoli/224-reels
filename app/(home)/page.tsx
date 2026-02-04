import { getMuxVideos } from "../action/getMuxVideos";
import HomeClient from "./(components)/HomeClient";

export default async function Home() {

  const videos = await getMuxVideos();
  console.log(videos.data[2].duration);
  

  return (
   <HomeClient videos={videos.data} />
  );
}
