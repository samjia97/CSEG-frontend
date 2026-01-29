'use client' // Error boundaries must be Client Components

import StandardErrorPage from "@/components/custom/StandardErrorPage";

/**
 * Copied from https://nextjs.org/docs/app/getting-started/error-handling#handling-uncaught-exceptions
 * @param error
 * @param reset
 * @constructor
 */
export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string }
  reset: () => void
}) {


  return (
      <StandardErrorPage error={error} reset={reset}/>
  )
}