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
    // const router = useRouter();

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
                </div>
                <div className="flex z-20 items-center h-dvh">
                    <h1>{reel?.title}</h1>
                    <p>{reel?.desc}</p>
                </div>
            </div>
        </Wrapper>
    )
}

export default page