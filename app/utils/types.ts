import Mux from "@mux/mux-node";

export type VideoAsset = Mux.Video.Asset;

export interface HomepageClientProps {
    videos: VideoAsset[];
}