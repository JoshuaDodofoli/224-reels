'use client'
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import Wrapper from "../Wrapper";
import { navLinks } from "@/app/utils/data";
import Link from "next/link";

const Nav = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <AnimatePresence>
        {
          isOpen && <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute bg-black/40 inset-0 z-40" />
        }
      </AnimatePresence>

      <div className="fixed left-0 top-0 z-60 w-full">
        <Wrapper>
          <motion.nav
            initial={{ height: '3.5rem', maxWidth: '360px' }}
            animate={{ height: isOpen ? 'auto' : '3.5rem', maxWidth: isOpen ? '450px' : '360px' }}
            className="relative mx-auto border-[0.5px] border-grey-300 rounded-xl mt-8 bg-transparent">
            <div className="w-full flex flex-col items-center py-2">
              <div className="flex items-center justify-between w-full h-full px-4">
                <div className="bg-background w-10 h-10 rounded-lg" />
                <div className="">
                  <span className="font-sans text-xl font-semibold text-background">
                    <Link href="/">244 reels</Link>
                  </span>
                </div>
                <div onClick={() => handleToggle()} className="flex cursor-pointer flex-col size-10 items-center justify-center gap-2">
                  <span className="h-px w-7 bg-background"></span>
                  <span className="h-px w-7 bg-background"></span>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, transition: { duration: 0.3 } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0 } }}
                  className="w-full h-auto">
                  <div className="">
                    <ul className="p-4">
                      {navLinks.map((link, index) => {
                        return (
                          <li key={index} onClick={handleToggle} className="py-1">
                            <Link href={link.path}>{link.title}</Link>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="">
                      <div className="bg-red-200 w-full h-full" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.nav>
        </Wrapper>
      </div>
    </>
  )
}

export default Nav