"use client"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"

import {Form} from "@/components/ui/form"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError
} from "@/components/ui/field"
import {
  Button
} from "@/components/ui/button"
import {
  Input
} from "@/components/ui/input"
import {
  Textarea
} from "@/components/ui/textarea"

const formSchema = z.object({
  full_name: z.string().min(1).min(0).max(100),
  preferred_name: z.string().min(1).min(0).max(100).optional(),
  affiliation: z.string().min(1).min(0).max(200).optional(),
  signup_email: z.string(),
  about_you: z.string(),
  topics: z.string(),
  volunteer: z.string()
});

export default function MyForm() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      // toast(
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
    } catch (error) {
      console.error("Form submission error", error);
      // toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <Field>
            <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
            <Input
                id="full_name"
                placeholder=""

                {...form.register("full_name")}
            />

            <FieldError>{form.formState.errors.full_name?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-12 gap-4">

            <div className="col-span-4">
              <Field>
                <FieldLabel htmlFor="preferred_name">Preferred Name</FieldLabel>
                <Input
                    id="preferred_name"
                    placeholder=""

                    {...form.register("preferred_name")}
                />

                <FieldError>{form.formState.errors.preferred_name?.message}</FieldError>
              </Field>
            </div>

          </div>
          <Field>
            <FieldLabel htmlFor="affiliation">Affiliation</FieldLabel>
            <Input
                id="affiliation"
                placeholder=""

                {...form.register("affiliation")}
            />
            <FieldDescription>Which universities or organisations are you affiliated with?</FieldDescription>
            <FieldError>{form.formState.errors.affiliation?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="signup_email">E-mail addresss</FieldLabel>
            <Input
                id="signup_email"
                placeholder=""

                {...form.register("signup_email")}
            />

            <FieldError>{form.formState.errors.signup_email?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="about_you">About you</FieldLabel>
            <Textarea
                id="about_you"
                placeholder=""

                {...form.register("about_you")}
            />
            <FieldDescription>Briefly describe your professional background, emphasising any experiences, roles, or research you have had in the field of education.</FieldDescription>
            <FieldError>{form.formState.errors.about_you?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="topics">Topics</FieldLabel>
            <Textarea
                id="topics"
                placeholder=""

                {...form.register("topics")}
            />
            <FieldDescription>What topics are you mostly interested in within the area of CS Education?</FieldDescription>
            <FieldError>{form.formState.errors.topics?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="volunteer">Would you be willing to volunteer to deliver a Talk in CS Education in the name of the group, internally or externally?</FieldLabel>
            <Input
                id="volunteer"
                placeholder=""
                {...form.register("volunteer")}
            />

            <FieldError>{form.formState.errors.volunteer?.message}</FieldError>
          </Field>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
  )
}