"use client"
import {useSession, signOut} from "next-auth/react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {useRouter} from "next/navigation"

export function AuthNavItem() {
  const {data: session, status} = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    return <Link href="/login" className="text-sm font-medium px-4 py-2">Log in</Link>;
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">{session.user?.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => router.push("/account")}>
            Account settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/reset-password")}>
            Change password
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => signOut({callbackUrl: "/"})}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
