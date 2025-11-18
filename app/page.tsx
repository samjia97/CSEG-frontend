"use client";
import {Button} from "@/components/ui/button";
import {Navbar03} from "@/components/ui/shadcn-io/navbar-03";
import Link from "next/link"
export default function Home() {
  return (
      <main className="w-full pt-4">
        <div className={"w-full flex flex-col items-center"}>
          <Link className={"text-2xl italic underline"} href={"https://www.ed.ac.uk/informatics"}>School of informatics</Link>
          <h1 className={"text-3xl text-primary"}>Computer Science Education Group (CSEG)</h1>
        </div>
      </main>
  );
}
