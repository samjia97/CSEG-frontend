"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {signIn} from "next-auth/react"
import {useRouter, useSearchParams} from "next/navigation"
import {useState} from "react"
import Link from "next/link"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

const formSchema = z.object({
  identifier: z.email(),
  password: z.string().min(1, "Field is required"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)})
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loginError, setLoginError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError(null);
    const result = await signIn("credentials", {...values, redirect: false});
    if (result?.error) {
      setLoginError("Incorrect email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Log in</h1>
        {loginError && (
            <div className="py-3 mb-4 bg-red-100 text-red-800 rounded-md text-center">{loginError}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="identifier">Email</FieldLabel>
              <Input id="identifier" type="email" {...form.register("identifier")} />
              <FieldError>{form.formState.errors.identifier?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...form.register("password")} />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                Forgot password?
              </Link>
            </Field>
            <Button type="submit" className="w-full">Log in</Button>
          </form>
        </Form>
      </div>
  );
}
