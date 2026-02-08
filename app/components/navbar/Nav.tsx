'use client'
import { useGSAP } from "@gsap/react";
import Wrapper from "../Wrapper";
import { navLinks } from "@/app/utils/data";
import classNames from "classnames"; import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const Nav = () => {

  const pathName = usePathname();
  const linkRef = useRef(null);
  const closeRef = useRef(null);
  const isHomePage = pathName === '/' || pathName === '/works' || pathName === '/about';

  useGSAP(() => {
    const target = isHomePage ? linkRef.current : closeRef.current;
    if (!target) return;

    gsap.fromTo(target,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      }
    );
  }, [isHomePage]);


  return (
    <nav className="py-4 fixed top-0 left-0 w-full z-50">
      <Wrapper className="w-full flex items-center justify-between">
        <div className="flex items-center justify-center bg-black text-background px-2 py-px text-body lg:text-lg font-sans rounded-sm">
          <Link href='/'>
            <span className="mr-1 md:mr-2">224</span>
            <span className="">reels</span>
          </Link>
        </div>
        <div>
          {
            isHomePage ? (
              <ul ref={linkRef} className="flex items-center justify-center gap-1 md:gap-2">
                {navLinks.map((link, idx) => {
                  return (
                    <div key={idx} className="flex items-center justify-center gap-2">
                      <li className={classNames(pathName === link.path && 'underline ', "font-sans text-body lg:text-lg underline-offset-3 text-background hover:text-grey-400 duration-300")}>
                        <Link href={link.path}>{link.title}</Link>
                      </li>
                      <span className="font-bold text-caption text-background">
                        {idx < navLinks.length - 1 && '|'}
                      </span>
                    </div>
                  )
                })}
              </ul>
            ) : (
              <div ref={closeRef} className="">
                <Link href='/works' className="bg-black px-2 py-1">
                  <span className="">Close</span>
                </Link>
              </div>
            )
          }
        </div>
      </Wrapper>
    </nav>
  )
}

export default Nav
