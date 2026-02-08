import Wrapper from "@/app/components/Wrapper";
import { reelsData } from "@/app/utils/data";
import Image from "next/image";
import { notFound } from "next/navigation";

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
        <Wrapper className="w-screen mx-auto h-dvh overflow-hidden ">
            <div className=" flex flex-col">
                <div className="w-full h-full fixed inset-0">
                    <div className="relative w-full h-full">
                        <Image
                            src={reel?.img}
                            alt={reel?.title}
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>
                <div className="flex z-20 items-center pb-6 font-sans justify-end flex-col w-full h-dvh">
                    <h1 className="text-h3 font-semibold">{reel?.title}</h1>
                    <p className="text-body">{reel?.desc}</p>
                </div>
            </div>
        </Wrapper>
    )
}

export default page