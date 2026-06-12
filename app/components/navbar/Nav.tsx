'use client'
import { useGSAP } from "@gsap/react";
import Wrapper from "../Wrapper";
import { navLinks } from "@/app/utils/data";
import classNames from "classnames"; import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const Nav = () => {

  return (
    <nav className="py-4 fixed top-0 left-0 w-full z-50">
      <Wrapper className="w-full flex items-center justify-between">
       <div className="">224-reels</div>
       <div className="">224-reels</div>
      </Wrapper>
    </nav>
  )
}

export default Nav
