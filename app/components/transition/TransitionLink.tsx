'use client';

import React from 'react';
import { useTransition } from './TransitionContext';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, children, className, ...props }, ref) => {
  const { transitionTo } = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Instead of letting Next.js Link handle it, we intercept completely
    transitionTo(href);
  };

  // We use an anchor tag so it still looks like a link, but we completely hijack the click
  return (
    <a href={href} onClick={handleClick} className={className} ref={ref} {...props}>
      {children}
    </a>
  );
});

TransitionLink.displayName = 'TransitionLink';
