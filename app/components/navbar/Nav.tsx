'use client'
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import Wrapper from "../Wrapper";
import { navLinks } from "@/app/utils/data";
import Link from "next/link";

const Nav = () => {

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-8 left-0 w-full z-60">
      <Wrapper className="">
        <div className="flex gap-1 relative z-60">
          <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer size-10 bg-background">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 0.97 : 0, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
              className="w-full h-full bg-black" />
          </div>
          <div className="">
            <div onClick={() => setIsOpen(!isOpen)} onMouseEnter={() => setHoveredMenu(true)} onMouseLeave={() => setHoveredMenu(false)} className="size-10 bg-black/30
            # rounded-full overflow-hidden">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: hoveredMenu ? 0.96 : 1, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
                className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center gap-1 p-2 cursor-pointer">
                <span className="w-6 h-[0.5px] bg-black/50"></span>
                <span className="w-6 h-[0.5px] bg-black/50"></span>
              </motion.div>
            </div>
          </div>
        </div>
      </Wrapper>

      <AnimatePresence>
        {
          isOpen && <NavMenu />
        }
      </AnimatePresence>


    </nav>
  )
}

const NavMenu = () => {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: '0%', transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
      exit={{ x: '-100%', transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }}
      className="h-dvh max-w-3/4 md:max-w-1/3 w-full flex flex-col items-center justify-center bg-black/70 backdrop-blur-md fixed top-0 left-0 z-30">
      <ul className="text-background">
      {
        navLinks.map((link, index) => {
          return (
            <motion.li
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.3, delay: index * 0.1 } }}
            key={index} className="hero-title "><Link href={link.path}>{link.title}</Link></motion.li>
          )
        })
      }
      </ul>
    </motion.div>
  )
}

export default Nav
