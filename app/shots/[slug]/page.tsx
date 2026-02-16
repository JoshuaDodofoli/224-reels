import Wrapper from "@/app/components/Wrapper";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import SlugClient from "../(components)/SlugClient";

interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({ params }: PageProps) => {

    const { slug } = await params;

    const reel = reelsData.find((r) => r.slug === slug);

    if (!reel) return notFound();

    return (
       <SlugClient reel={reel} />
    )
}

export default page