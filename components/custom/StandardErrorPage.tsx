import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

/**
 * Copied from https://nextjs.org/docs/app/getting-started/error-handling#handling-uncaught-exceptions
 * @param error
 * @param reset
 * @constructor
 */
export default function StandardErrorPage({
                                error,
                                reset,
    message='Sorry, something went wrong',
                              }: {
  error: Error & { digest?: string }
  reset: () => void
  message?: string
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className={"flex flex-col gap-4 items-center"}>
          <h2>{message}</h2>
          <div className={"flex flex-col gap-4 w-40"}>
          <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
          >
            Try again
          </Button>
          <Button asChild
                  variant={"secondary"}
          >
            <Link href={"/"}>Navigate home</Link>
          </Button>
          </div>

        </div>
      </div>
  )
}