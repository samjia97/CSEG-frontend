"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import axios from "axios"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {baseURL} from "@/lib/api"
import {passwordSchema, PASSWORD_HINT} from "@/lib/password"

const formSchema = z.object({
  currentPassword: z.string().min(1, "Field is required"),
  password: passwordSchema,
  passwordConfirmation: z.string().min(1, "Field is required"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export default function ResetPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)})
  const router = useRouter();
  const {data: session, status, update} = useSession();
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setResetError(null);
    try {
      await axios.post(`${baseURL}/auth/change-password`, values, {
        headers: {Authorization: `Bearer ${session?.user.strapiToken}`},
      });
    } catch {
      setResetError("Could not reset password. Check your current password and try again.");
      return;
    }
    await update({mustResetPassword: false});
    router.push("/");
    router.refresh();
  }

  const isForced = session?.user?.mustResetPassword ?? false;

  return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">{isForced ? "Reset your password" : "Change your password"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isForced
              ? "You're using a temporary password. Please set a new password to continue."
              : "Enter your current password and choose a new one."}
        </p>
        {resetError && (
            <div className="py-3 mb-4 bg-red-100 text-red-800 rounded-md text-center">{resetError}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="currentPassword">{isForced ? "Temporary password" : "Current password"}</FieldLabel>
              <Input id="currentPassword" type="password" {...form.register("currentPassword")} />
              <FieldError>{form.formState.errors.currentPassword?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input id="password" type="password" {...form.register("password")} />
              <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="passwordConfirmation">Confirm new password</FieldLabel>
              <Input id="passwordConfirmation" type="password" {...form.register("passwordConfirmation")} />
              <FieldError>{form.formState.errors.passwordConfirmation?.message}</FieldError>
            </Field>
            <Button type="submit" className="w-full">Reset password</Button>
          </form>
        </Form>
      </div>
  );
}
