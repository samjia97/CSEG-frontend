"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {useState} from "react"
import axios from "axios"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {baseURL} from "@/lib/api"

const formSchema = z.object({
  email: z.email(),
});

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)})
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Strapi always responds ok:true here regardless of whether the email exists
    // to avoid leaking which emails are registered.
    try {
      await axios.post(`${baseURL}/auth/forgot-password`, values);
    } catch {
      // ignore - still show the generic confirmation below
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
        <div className="max-w-md mx-auto py-10">
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We have sent a link to reset your password.
          </p>
        </div>
    );
  }

  return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your email and we will send you a link to reset your password.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...form.register("email")} />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        </Form>
      </div>
  );
}
