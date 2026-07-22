'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {MenuButton} from "@/components/ui/menu-button";
import {
  NavigationMenu, NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import Image from 'next/image'
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <Image
        src={"/CSEG_Logo_Cropped.webp"}
        width={"144"}
        height={"60"}
        alt={"CSEG logo"}
        loading={"eager"}
    />
  )
}

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface Navbar03NavItem {
  href?: string;
  label: string;
  active?: boolean;
  children?: Navbar03NavItem[];
  isButton?: boolean;
}

export interface Navbar03Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar03NavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
  rightSlot?: React.ReactNode;
}

// Default navigation links
const defaultNavigationLinks: Navbar03NavItem[] = [
  { href: '#', label: 'Home', active: true },
  { href: '#', label: 'Features' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'About' },
];

export const Navbar03 = React.forwardRef<HTMLElement, Navbar03Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      signInText = 'Sign In',
      signInHref = '#signin',
      ctaText = 'Get Started',
      ctaHref = '#get-started',
      onSignInClick,
      onCtaClick,
      rightSlot,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);
    const router = useRouter();
    const pathname = usePathname().split("/").slice(0,2).join("/");


    /**
     * Redirects user to page based on menu item clicked.
     * @param e
     * @param href
     */
    const handleMenuItemClicked = (e: React.MouseEvent, href: string | undefined) => {
      e.preventDefault();
      if (typeof href === 'string'){
        router.push(href);
      } else {
        router.push("/");
      }
    }
    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-primary bg-white backdrop-blur supports-[backdrop-filter]:bg-white px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 justify-between">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <MenuButton
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </MenuButton>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <nav className="flex flex-col gap-0">
                    {navigationLinks.map((link, index) => {
                      const active = link.href === pathname || pathname.startsWith(link.href + '/');

                      // If has children, show parent label then children indented
                      if (link.children && link.children.length > 0) {
                        return (
                          <div key={index}>
                            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                              {link.label}
                            </div>
                            {link.children.map((child, childIndex) => (
                              <button
                                key={childIndex}
                                onClick={(e) => handleMenuItemClicked(e, child.href)}
                                className={cn(
                                  'flex w-full items-center rounded-md px-3 py-2 pl-6 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                  child.href === pathname && 'bg-accent/50'
                                )}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        );
                      }

                      // Regular link with no children
                      return (
                        <button
                          key={index}
                          onClick={(e) => handleMenuItemClicked(e, link.href)}
                          className={cn(
                            'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer',
                            active && 'bg-accent/50'
                          )}
                        >
                          {link.label}
                        </button>
                      );
                    })}
                    {rightSlot && <div className="px-3 py-2 border-t mt-1 pt-2">{rightSlot}</div>}
                  </nav>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}

          </div>
          <div className="flex items-center gap-6 w-full px-6">
            <Link href={logoHref}>
              {logo}
            </Link>
            {/* Navigation menu for desktop*/}
            {!isMobile && (
                <NavigationMenu className="flex" viewport={false}>
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => {
                      const active = pathname === link.href || pathname.startsWith(link.href + '/');

                      // If has children, render dropdown (not clickable, only opens dropdown)
                      if (link.children && link.children.length > 0) {
                        return (
                          <NavigationMenuItem key={index}>
                            <NavigationMenuTrigger
                              className={cn(
                                "inline-flex h-10 items-center px-4 py-2 text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground rounded-none",
                                active && "bg-accent/50"
                              )}
                              onClick={(e) => e.preventDefault()}
                            >
                              {link.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="p-0">
                              <ul className="py-1 min-w-[140px]">
                                {link.children.map((child, childIndex) => (
                                  <li key={childIndex}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={child.href || '/'}
                                        onClick={(e) => handleMenuItemClicked(e, child.href)}
                                        className="block px-3 py-1.5 text-sm hover:bg-accent whitespace-nowrap"
                                      >
                                        {child.label}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        );
                      }

                      // Regular link (no children) - desktop
                      return (
                        <NavigationMenuItem key={index}>
                          {link.isButton ?
                              <Button
                                onClick={(e) => handleMenuItemClicked(e, link.href)}

                                data-active={active || null}>
                                {link.label}
                              </Button>
                          :

                          <NavigationMenuLink
                              href={link.href}
                              onClick={(e) => handleMenuItemClicked(e, link.href)}
                              className={cn(
                                "inline-flex h-10 items-center px-4 py-2 text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-none",
                                active && "bg-accent/50"
                              )}
                              data-active={active || null}
                          >
                            {link.label}
                          </NavigationMenuLink>
                          }
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
            )}
            {rightSlot && <div className="flex items-center ml-auto">{rightSlot}</div>}
          </div>
        </div>
      </header>
    );
  }
);

Navbar03.displayName = 'Navbar03';

export { Logo, HamburgerIcon };