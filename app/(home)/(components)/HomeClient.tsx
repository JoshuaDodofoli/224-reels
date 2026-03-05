'use client'

import { timelineEntries } from "@/app/utils/data";

export default function Home() {

  return (
    <section className="w-full min-h-screen fill">
      <ul>
        {timelineEntries.map((entry, i) => {
          return (
            <div key={i} className="h-screen p-5">
              <li className="relative h-full w-full">
                {entry.images.map((image, j) => {
                  return (
                    <div key={j} className={`absolute size-full ${image.position} ${image.width}`}>
                      <img
                        className={`absolute ${image.aspectRatio} object-cover`}
                        src={image.src}
                        alt={image.alt}
                      />
                    </div>
                  )
                })}
              </li>
            </div>
          )
        })}
      </ul>
    </section>
  );
}