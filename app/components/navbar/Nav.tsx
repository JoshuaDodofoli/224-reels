'use client'
import Wrapper from "../Wrapper";
import { useState } from "react";
import Menu from "./Menu";
import { usePathname } from "next/navigation";
import { useView } from "@/app/utils/context/ViewContext";

const Nav = () => {

  const { view, setView } = useView();
  const [toggleMenu, setToggleMenu] = useState(false);
  const pathName = usePathname();

  const handleView = (v: 'slider' | 'list') => {
    setView(v);
  }

  const handleMenu = () => {
    setToggleMenu((prev) => !prev);
  }

  return (
    <nav className="py-4 fixed top-0 left-0 w-full z-50">
      <Wrapper className="w-full flex items-center justify-between">
        <div className=""></div>
        {
          pathName !== '/about' && (
            <div className="hidden md:block">
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
          <button onClick={handleMenu} className="cursor-pointer relative bg-grey-700 text-grey-200 px-2 z-20 h-6 overflow-hidden">
            <div className={`flex flex-col transition-transform duration-500 ease-in-out ${toggleMenu ? '-translate-y-1/2' : 'translate-y-0'}`}>
              <span className="text-lg h-6 flex items-center justify-center">Menu</span>
              <span className="text-lg h-6 flex items-center justify-center">Close</span>
            </div>
          </button>

          <Menu
            handleMenu={handleMenu}
            toggleMenu={toggleMenu}
            view={view}
            handleView={handleView}
          />
        </div>
      </Wrapper>
    </nav>
  )
}

export default Nav
