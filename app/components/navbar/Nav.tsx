'use client'
import { motion } from "motion/react"
import { useState } from "react"
import Wrapper from "../Wrapper";

const Nav = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      {
        isOpen && <div className="absolute bg-black/10 inset-0 z-40" />
      }
      <Wrapper>
        <motion.nav
          initial={{ height: '3.5rem', maxWidth: '360px' }}
          animate={{ height: isOpen ? 'auto' : '3.5rem', maxWidth: isOpen ? '450px' : '360px' }}
          className="relative mx-auto border-[0.5px] border-grey-300 rounded-xl mt-8 z-60 bg-background">
          <div className="w-full flex flex-col items-center py-2">

            <div className="flex items-center justify-between w-full h-full px-4">
              <div className="bg-grey-500 w-10 h-10 rounded-lg" />
              <div className="">
                <span className="font-sans text-xl font-semibold">244 reels</span>
              </div>
              <div onClick={() => handleToggle()} className="flex cursor-pointer flex-col gap-2">
                <span className="bg-grey-500 h-px w-7"></span>
                <span className="bg-grey-500 h-px w-7"></span>
              </div>
            </div>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              className="w-full h-auto">
              <div className="">
                <ul className="p-4">
                  <li>Home</li>
                  <li>Home</li>
                  <li>Home</li>
                  <li>Home</li>
                </ul>
                <div className="">
                  <div className="bg-red-200 w-full h-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.nav>
      </Wrapper>
    </>
  )
}

export default Nav