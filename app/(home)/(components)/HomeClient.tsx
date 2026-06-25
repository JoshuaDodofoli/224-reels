"use client";

import { useEffect } from "react";
import { useView } from "@/app/utils/context/ViewContext";
import SliderView from "./SliderView";
import ListView from "./ListView";

export default function HomeClient() {
    const { view } = useView();

    // Lock the page in place on the homepage — no scrolling at all.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <div key={view} className="transition-opacity duration-300">
            {view === "slider" ? <SliderView /> : <ListView />}
        </div>
    );
}
