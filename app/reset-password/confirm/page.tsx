import {Suspense} from "react"
import {ResetPasswordConfirmForm} from "./ResetPasswordConfirmForm"

export default function ResetPasswordConfirmPage() {
  return (
      <Suspense fallback={<div className="max-w-md mx-auto py-10">Loading...</div>}>
        <ResetPasswordConfirmForm/>
      </Suspense>
  );
}
