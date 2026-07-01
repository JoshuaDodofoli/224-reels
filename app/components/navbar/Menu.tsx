import { useMenu } from "@/app/utils/hooks/useMenu";
import { TransitionLink } from "@/app/components/transition/TransitionLink";
import { useRef } from "react";

interface MenuProps {
    handleMenu: () => void;
    toggleMenu: boolean;
}

const Menu = ({ handleMenu, toggleMenu }: MenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useMenu({ menuRef, toggleMenu });

    return (
        <div
            ref={menuRef}
            className="absolute top-0 right-0 bg-grey-500 text-grey-200 z-10 w-0 h-0 overflow-hidden"
        >
            <div className="p-2 mt-5">
                <ul className="flex flex-col text-sm w-full mb-4">
                    <li
                        onClick={handleMenu}
                        className="cursor-pointer w-full relative pb-2 mb-2"
                    >
                        <TransitionLink href={"/"}>
                            <span className="menu-text text-sm inline-block opacity-0">
                                Archive
                            </span>
                            <span className="menu-line absolute bottom-0 left-0 w-0 h-[0.5px] bg-grey-300 inline-block" />
                        </TransitionLink>
                    </li>
                    <li
                        onClick={handleMenu}
                        className="cursor-pointer w-full relative pb-2 mb-2"
                    >
                        <TransitionLink href={"/about"}>
                            <span className="menu-text text-sm inline-block opacity-0">
                                About
                            </span>
                            <span className="menu-line absolute bottom-0 left-0 w-0 h-[0.5px] bg-grey-300 inline-block" />
                        </TransitionLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Menu;
