'use client' // Error boundaries must be Client Components

import StandardErrorPage from "@/components/custom/StandardErrorPage";

/**
 * Error boundary for publications page
 * Handles errors when fetching publications or topics
 */
export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
      <StandardErrorPage 
        error={error} 
        reset={reset}
        message="We experienced a server error loading publications"
      />
  )
}
