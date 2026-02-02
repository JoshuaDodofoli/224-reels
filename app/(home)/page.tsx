'use client';
import Image from "next/image";
import { reelsData } from "../utils/data";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {

  const [currentReel, setCurrentReel] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReel((prev: number) => (prev + 1) % reelsData.length)
    }, 5000);
    return () => clearInterval(interval);
  }, [currentReel])

  const MotionImg = motion(Image);

  return (
    <section className="w-full h-screen absolute inset-0  bg-black">
      <div className="relative w-full h-full">
        <AnimatePresence mode="sync">
          <MotionImg
          key={reelsData[currentReel].img}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            src={reelsData[currentReel].img} alt={"Hero img"} fill className="object-center object-cover" />
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-full">
              <motion.p
                key={reelsData[currentReel].title}
                className="fixed h-screen inset-0 w-full flex items-center justify-center font-semibold hero-title uppercase text-background"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                {reelsData[currentReel].title}
              </motion.p>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </section >
  );
}
