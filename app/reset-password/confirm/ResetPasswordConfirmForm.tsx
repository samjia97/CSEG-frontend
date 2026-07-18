"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {signIn} from "next-auth/react"
import {useRouter, useSearchParams} from "next/navigation"
import {useState} from "react"
import axios from "axios"
import Link from "next/link"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {baseURL} from "@/lib/api"
import {passwordSchema, PASSWORD_HINT} from "@/lib/password"

const formSchema = z.object({
  password: passwordSchema,
  passwordConfirmation: z.string().min(1, "Field is required"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export function ResetPasswordConfirmForm() {
  const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)})
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [resetError, setResetError] = useState<string | null>(null);

  if (!code) {
    return (
        <div className="max-w-md mx-auto py-10">
          <h1 className="text-2xl font-bold mb-2">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired.{" "}
            <Link href="/forgot-password" className="underline">Request a new one</Link>.
          </p>
        </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setResetError(null);
    let email: string | undefined;
    try {
      const response = await axios.post(`${baseURL}/auth/reset-password`, {
        code,
        ...values,
      });
      email = response.data?.user?.email;
    } catch {
      setResetError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }

    const result = await signIn("credentials", {
      identifier: email,
      password: values.password,
      redirect: false,
    });
    if (result?.error) {
      // Triggered when password was reset successfully in Strapi, but the automatic sign-in
      // failed for some reason.
      // send them to log in page instead.
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Choose a new password</h1>
        {resetError && (
            <div className="py-3 mb-4 bg-red-100 text-red-800 rounded-md text-center">{resetError}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
