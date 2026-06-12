'use client'
import Wrapper from "../Wrapper";
import { useState } from "react";
import Menu from "./Menu";

const Nav = () => {

  const [view, setView] = useState<'' | 'list' | 'grid'>('list');
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleView = (view: '' | 'list' | 'grid') => {
    setView(view)
      ;
  }

  const handleMenu = () => {
    setToggleMenu((prev) => !prev);
  }

  return (
    <nav className="py-4 fixed top-0 left-0 w-full z-50">
      <Wrapper className="w-full flex items-center justify-between">
        <div className="">224-reels</div>
        <div className="hidden md:block">
          <ul className="flex items-center gap-3 text-sm px-2 py-1">
            <li onClick={() => handleView('grid')} className="flex cursor-pointer items-center gap-2">
              <span className={`${view === 'grid' ? 'h-2 w-2' : 'w-0'} bg-grey-700 inline-block ease-in-out duration-300`} />
              <p>Grid</p>
            </li>
            |
            <li onClick={() => handleView('list')} className="flex cursor-pointer items-center gap-2">
              <span className={`${view === 'list' ? 'h-2 w-2' : 'w-0'} bg-grey-700 inline-block ease-in-out duration-300`} />
              <p>List</p>
            </li>
          </ul>
        </div>

        <div className="relative">
          <button onClick={handleMenu} className="cursor-pointer relative bg-grey-700 text-white px-2 z-20">
            <p className="text-sm">Menu</p>
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
