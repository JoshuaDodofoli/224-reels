"use client";

import React from "react";
import { useTransition } from "./TransitionContext";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    className?: string;
}

// Only intercept plain same-origin left-clicks; let everything else pass through natively.
const shouldIntercept = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    target?: string,
) => {
    if (e.defaultPrevented) return false;
    if (e.button !== 0) return false; // middle / right click
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false; // modifier keys
    if (target && target !== "_self") return false; // _blank etc.
    try {
        const url = new URL(href, window.location.href);
        return url.origin === window.location.origin;
    } catch {
        return false;
    }
};

export const TransitionLink = React.forwardRef<
    HTMLAnchorElement,
    TransitionLinkProps
>(({ href, children, className, onClick, target, ...props }, ref) => {
    const { transitionTo } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (!shouldIntercept(e, href, target)) return;
        e.preventDefault();
        transitionTo(href);
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={className}
            ref={ref}
            target={target}
            {...props}
        >
            {children}
        </a>
    );
});

TransitionLink.displayName = "TransitionLink";
