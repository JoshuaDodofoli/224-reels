'use client'
import { reelsData } from "@/app/utils/data"
import Card from "./Card"

const Work = () => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[70px_1fr_400px] gap-1 w-full h-full">
            {reelsData.map((reel, idx) => (
                <Card key={reel.slug || idx} reel={reel} />
            ))}
        </div>
    )
}

export default Work