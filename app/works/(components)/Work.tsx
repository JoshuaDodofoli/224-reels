import { reelsData } from "@/app/utils/data"
import Card from "./Card"

const Work = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full h-full">
            {reelsData.map((reel, idx) => {
                return (
                    <Card key={idx} reel={reel} />
                )
            })}
        </div>
    )
}

export default Work