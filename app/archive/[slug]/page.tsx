import { reelsData } from "@/app/utils/data";
import { notFound } from "next/navigation";
import SlugClient from "../(components)/SlugClient";

interface SlugPageProps {
    params: Promise<{ slug: string }>
}

const page = async ({ params }: SlugPageProps) => {
    const { slug } = await params;
    const reel = reelsData.find((r) => r.slug === slug);
    
    if (!reel) {
        return notFound();
    }

    return (
        <SlugClient reel={reel} />
    )
}

export default page;