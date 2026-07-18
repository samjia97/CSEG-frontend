"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {useSession} from "next-auth/react"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import axios from "axios"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {baseURL} from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters").max(100),
  description: z.string().max(500, "Must be 500 characters or fewer").optional(),
});

export default function AccountPage() {
  const {data: session, status, update} = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name ?? "",
        description: session.user.description ?? "",
      });
    }
  }, [session?.user?.name, session?.user?.description, session?.user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setSaved(false);
    const description = values.description ?? "";
    try {
      await axios.put(
        `${baseURL}/account/profile`,
        {name: values.name, description},
        {headers: {Authorization: `Bearer ${session?.user.strapiToken}`}},
      );
    } catch (e) {
      const msg = axios.isAxiosError(e) ? e.response?.data?.error?.message : null;
      setError(msg || "Could not update your profile. Please try again.");
      return;
    }
    await update({name: values.name, description});   // refresh the session
    setSaved(true);
    router.refresh();
  }

  if (status === "loading") return <div className="max-w-md mx-auto py-10">Loading...</div>;

  return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">Account settings</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your name is shown on your blogs, forum threads and replies. Your description is a short
          bio you can add to your blogs.
        </p>
        {saved && (
            <div className="py-3 mb-4 bg-green-100 text-green-800 rounded-md text-center">
              Your profile has been updated.
            </div>
        )}
        {error && (
            <div className="py-3 mb-4 bg-red-100 text-red-800 rounded-md text-center">{error}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="name">Preferred name</FieldLabel>
              <Input id="name" {...form.register("name")} />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                className="min-h-24"
                maxLength={500}
                placeholder="A short bio about yourself (optional)"
                {...form.register("description")}
              />
              <FieldError>{form.formState.errors.description?.message}</FieldError>
            </Field>
            <Button type="submit" className="w-full">Save</Button>
          </form>
        </Form>
        <p className="mt-6 text-sm text-muted-foreground">
          If you are going to switch to a different email, please{" "}
          <Link href="/contact" className="text-primary underline">contact us</Link>{" "}
          so we can update the email you use for login.
        </p>
      </div>
  );
}
