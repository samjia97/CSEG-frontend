import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Navbar03, Navbar03NavItem, Navbar03Props} from "@/components/ui/shadcn-io/navbar-03";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LinkedinIcon} from "react-share";

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

const navigationLinks: Navbar03NavItem[] = [
  {
    href:"/",
    label:"Home",
  },
  {
    label:"About us",
    children: [
      {
        label:"Our people",
        href:"/about/people"
      },
      {
        label:"Our aims",
        href: "/about"
      }
    ]
  },
  {
    href:"/events",
    label:"Events",
  },
  {
    href:"/news",      // ← NEW
    label:"News",     // ← NEW
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
      <nav>
        <Navbar03
            logoHref={"/"}
            navigationLinks={navigationLinks}
        />
      </nav>
      <main className={"min-h-100 max-w-5xl mx-auto px-4"}>
        {children}
      </main>
      <footer className={"h-[264px] bg-neutral-800 px-10 py-4 mt-8"}>
        <p className={"text-white text-xl font-bold"}>Computer Science Education Group</p>
        <div className={"grid grid-cols-3 pt-4 px-4 w-2xl"}>
          <nav className={"flex flex-col gap-2"}>
            <Link href={"/"} className={"text-primary text-lg"}>Home</Link>
            <Link href={"/about"} className={"text-primary text-lg"}>About us</Link>
            <Link href={"/events"} className={"text-primary text-lg"}>Events</Link>
            <Link href={"/news"} className={"text-primary text-lg"}>News</Link>  {/* ← NEW */}
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
      </body>
      </html>
  );
}
