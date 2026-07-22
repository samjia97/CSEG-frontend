import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Navbar03, Navbar03NavItem, Navbar03Props} from "@/components/ui/shadcn-io/navbar-03";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LinkedinIcon} from "react-share";
import {SessionProvider} from "next-auth/react";
import {AuthNavItem} from "@/components/custom/auth-nav-item";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Science Education Group (CSEG)",
  description: "New website",
};

// Render every route at request time instead of prerendering at build. The site
// is entirely CMS-backed, so the build should not depend on a running Strapi
// backend; pages fetch Strapi live when served. Cascades to all routes.
export const dynamic = "force-dynamic";

const navigationLinks: Navbar03NavItem[] = [
  {
    href:"/",
    label:"Home",
  },
  {
    label:"Our people",
    href:"/about/people"
  },
  {
    label:"Our Aims",
    href: "/about"
  },
  {
    href:"/events",
    label:"Events",
  },
  {
    href:"/news",
    label:"News",
  },
  {
    href:"/forum",
    label:"Forum",
  },
  {
    href:"/blog",
    label:"Blogs",
  },
  {
    href:"/research",
    label:"Research Projects",
  },
  {
    href:"/publications",
    label:"Publications",
  },
  {
    href:"/contact",
    label:"Contact us",
  },
  {
    href:"/join",
    label:"Join us",
    isButton: true,
  },
]

const NavBarProps: Navbar03Props = {
  logoHref: "/",
  navigationLinks: navigationLinks,
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={""}>
      <SessionProvider>
      <nav>
        <Navbar03
            logoHref={"/"}
            navigationLinks={navigationLinks}
            rightSlot={<AuthNavItem/>}
        />
      </nav>
      <main className={"min-h-100 max-w-5xl mx-auto px-4"}>
        {children}
      </main>
      <footer className={"min-h-[264px] bg-neutral-800 px-10 py-4 mt-8"}>
        <p className={"text-white text-xl font-bold"}>Computer Science Education Group</p>
        <div className={"flex flex-wrap gap-x-16 gap-y-6 pt-4 px-4"}>
          <nav className={"grid grid-flow-col grid-rows-4 gap-x-10 gap-y-2 w-fit"}> {/* grid-rows-4 (4 in a column) */}
            <Link href={"/"} className={"text-primary text-lg"}>Home</Link>
            <Link href={"/about"} className={"text-primary text-lg"}>About us</Link>
            <Link href={"/events"} className={"text-primary text-lg"}>Events</Link>
            <Link href={"/news"} className={"text-primary text-lg"}>News</Link>
            <Link href={"/forum"} className={"text-primary text-lg"}>Forum</Link>
            <Link href={"/blog"} className={"text-primary text-lg"}>Blogs</Link>
            <Link href={"/publications"} className={"text-primary text-lg"}>Publications</Link>
            <Link href={"/research"} className={"text-primary text-lg"}>Research Projects</Link>
          </nav>
          <nav className={"flex flex-col gap-2 w-fit"}>
            <Button asChild>
              <Link href={"/join"}>Join us</Link>
            </Button>
            <Button asChild>
              <Link href={"/contact"}>Contact us</Link>
            </Button>
          </nav>
          <div>
            <p className={"text-white text-lg"}>Follow us</p>
            <Link href={"https://www.linkedin.com/groups/13122419/"}>
              <LinkedinIcon size={32}/>
            </Link>
          </div>
        </div>
      </footer>
      </SessionProvider>
      </body>
      </html>
  );
}
