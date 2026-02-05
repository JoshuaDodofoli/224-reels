'use client'
import Wrapper from "../Wrapper";
import { navLinks } from "@/app/utils/data";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {

  const pathName = usePathname();

  return (
    <nav className="py-3 fixed top-0 left-0 w-full z-50 bg-transparent">
      <Wrapper className="w-full flex items-center justify-between">
        <div className="flex items-center justify-center bg-black text-background px-2 py-px">
          <Link href='/'>
            <span className="mr-1 md:mr-2">224</span>
            <span>reels</span>
          </Link>
        </div>
        <div className="">
          <ul className="flex items-center justify-center gap-1 md:gap-2">
            {navLinks.map((link, idx) => {
              return (
                <div key={idx} className="flex items-center justify-center gap-2">
                  <li className={classNames(pathName === link.path && 'underline', "font-sans text-background mix-blend-difference font-medium text-body underline-offset-3 hover:text-grey-400 duration-300")}>
                    <Link href={link.path}>{link.title}</Link>
                  </li>
                  <span className="font-bold">
                    {idx < navLinks.length - 1 && '/'}
                  </span>
                </div>
              )
            })}
          </ul>
        </div>
      </Wrapper>
    </nav>
  )
}

export default Nav
