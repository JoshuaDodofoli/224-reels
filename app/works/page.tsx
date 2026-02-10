'use client'
import { useRef, useState } from "react";
import Wrapper from "../components/Wrapper"
import Work from "./(components)/Work"
import classNames from "classnames";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const page = () => {

  const [selected, setSelected] = useState(0);
  const filterRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<(HTMLSpanElement | null)[]>([]);

  const handleSelect = (idx: number) => {
    setSelected(idx);
  }

  const filters = [
    { name: "All" },
    { name: "Reels" },
    { name: "Snippets" },
  ];

  useGSAP(() => {
    if (!filterRef.current || !lineRef.current) return;

    gsap.set(filterRef.current, {
      opacity: 0,
      y: 10
    })

    gsap.to(filterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: {
        each: 0.1,
        from: 'start'
      }
    })

    gsap.set(lineRef.current, {
      opacity: 0,
      y: 10
    })
    gsap.to(lineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: {
        each: 0.1,
        from: 'start'
      }
    }) 

  }, [])

  return (
    <section className="my-24 font-sans h-full">
      <Wrapper>
        <div className="flex gap-2 lg:gap-3 text-body lg:text-h3 font-medium lg:font-normal">
          {filters.map((f, idx) => {
            return (
              <div key={idx} className=" flex items-center gap-2">
                <div ref={(el) => { filterRef.current[idx] = el }} onClick={() => handleSelect(idx)} className={classNames("flex gap-2 cursor-pointer", idx === selected ? "text-white" : "text-grey-400")}>
                  <span className=" hover:underline underline-offset-4 duration-300">{f.name}</span>
                </div>
                <span ref={(el) => { lineRef.current[idx] = el }} className="lg:ml-1 text-background text-caption">{idx < filters.length - 1 && "|"}</span>
              </div>
            )
          })}
        </div>

        <div className="py-12">
          <Work selected={selected} />
        </div>

      </Wrapper>
    </section>
  )
}

export default page