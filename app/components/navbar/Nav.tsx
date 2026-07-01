'use client'
import Wrapper from "../Wrapper";
import { useState, useRef } from "react";
import Menu from "./Menu";
import { usePathname } from "next/navigation";
import { useView } from "@/app/utils/context/ViewContext";
import { useIntro } from "@/app/utils/context/IntroContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Nav = () => {

  const { view, setView } = useView();
  const { isComplete } = useIntro();
  const navRef = useRef<HTMLElement>(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const pathName = usePathname();

  useGSAP(() => {
    if (!isComplete) {
      gsap.set(navRef.current, { y: -30, opacity: 0 });
      return;
    }
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    });
  }, { scope: navRef, dependencies: [isComplete] });

  const handleView = (v: 'slider' | 'list') => {
    setView(v);
  }

  const handleMenu = () => {
    setToggleMenu((prev) => !prev);
  }

  return (
    <nav ref={navRef} className="py-4 fixed top-0 left-0 w-full z-50">
      <Wrapper className="w-full flex items-center justify-between">
        <div className=""></div>
        {
          pathName === '/' && (
            <div className="absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-3 text-sm px-2 py-1">
                <li onClick={() => handleView('slider')} className="flex cursor-pointer items-center gap-2">
                  <span className={`${view === 'slider' ? 'h-2 w-2' : 'w-0'} bg-grey-700 inline-block ease-in-out duration-300`} />
                  <p>Slider</p>
                </li>
                |
                <li onClick={() => handleView('list')} className="flex cursor-pointer items-center gap-2">
                  <span className={`${view === 'list' ? 'h-2 w-2' : 'w-0'} bg-grey-700 inline-block ease-in-out duration-300`} />
                  <p>List</p>
                </li>
              </ul>
            </div>
          )
        }


        <div className="relative">
          <button onClick={handleMenu} className="cursor-pointer relative bg-grey-500 text-grey-200 px-2 z-20 h-6 overflow-hidden">
            <div className={`flex flex-col transition-transform duration-500 ease-in-out ${toggleMenu ? '-translate-y-1/2' : 'translate-y-0'}`}>
              <p className="text-sm h-6 flex items-center justify-center">Menu</p>
              <p className="text-sm h-6 flex items-center justify-center">Close</p>
            </div>
          </button>

          <Menu
            handleMenu={handleMenu}
            toggleMenu={toggleMenu}
          />
        </div>
      </Wrapper>
    </nav>
  )
}

export default Nav
