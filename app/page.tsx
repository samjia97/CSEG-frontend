"use client";
import {Button} from "@/components/ui/button";
import {Navbar03} from "@/components/ui/shadcn-io/navbar-03";
export default function Home() {
  return (
      <main className="w-full pt-4">

       <Button onClick={() => alert('Hello Shad')}>Your name</Button>
      </main>
  );
}
