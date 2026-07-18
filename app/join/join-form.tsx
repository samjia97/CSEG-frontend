"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"

import {Form} from "@/components/ui/form"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import createApplication from "@/app/join/api/create-application";
import {useState} from "react";

type volunteerOption = "yes-internally" | "yes-externally" | "no";

const formSchema = z.object({
  fullName: z.string().min(1,"Field is required").max(100, "Maximum length is 100 characters"),
  preferredName: z.string().max(100).optional(),
  affiliations: z.string().max(2000, "Maximum length is 2000 characters").optional(),
  email: z.email(),
  aboutYou: z.string().min(1, "Field is required").max(2000, "Maximum length is 2000 characters"),
  topics: z.string().min(1, "Field is required").max(2000, "Maximum length is 2000 characters"),
});

const SuccessMessage = () => (
    <div className={"flex justify-center"}>
      <div className="py-4 w-full max-w-5xl bg-green-100 text-green-800 rounded-md text-center">
        <h4>Thank you for your application to join CSEG</h4>
        <p>We will get in touch by email soon</p>
      </div>
    </div>
)
const FailureMessage = () => (
    <div className={"flex justify-center"}>
      <div className="py-4 w-full max-w-5xl bg-red-100 text-red-800 rounded-md text-center">
        <h4>We encountered a server error handling your application</h4>
        <p>Please try re-applying after a few hours or contact us at cseg@ed.ac.uk</p>
      </div>
    </div>
)

export default function MyForm() {
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
  })
  const [submissionError, setSubmissionError] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      await createApplication(values);
      setSubmissionError(false);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Form submission error", error);
      setSubmissionError(true);
      setSubmissionSuccess(false)
    } finally {
      window.scrollTo({
        top:0,
        behavior:"smooth"
      })
    }
  }

  return (
      <div className={"w-full"}>
        {submissionSuccess ? <SuccessMessage /> : null}
        {submissionError ? <FailureMessage /> : null}

        {!submissionSuccess && <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">
            {/* The direct registration with ...form.register pattern is simpler than the FormField render method*/}
            <Field>
              <FieldLabel htmlFor="fullName">Full Name<span className={"text-red-500 p-0 m-0"}>*</span></FieldLabel>
              <Input
                  id="fullName"
                  placeholder=""
                  aria-required

                  {...form.register("fullName")}
              />

              <FieldError>{form.formState.errors.fullName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="preferredName">Preferred Name</FieldLabel>
              <Input
                  id="preferredName"
                  placeholder="This is the name shown on your blogs, forum threads and replies."

                  {...form.register("preferredName")}
              />

              <FieldError>{form.formState.errors.preferredName?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="affiliations" className={"flex-col items-start"}>
                <p>Affiliations</p>
                <p className={"font-normal"}>Which universities or organisations are you affiliated with?</p>
              </FieldLabel>
              <Input
                  id="affiliations"
                  placeholder=""
                  {...form.register("affiliations")}
              />
              <FieldError>{form.formState.errors.affiliations?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail address<span className={"text-red-500"}>*</span></FieldLabel>
              <Input
                  id="email"
                  placeholder="It will be the account you use for logging in."
                  aria-required
                  {...form.register("email")}
              />

              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="aboutYou" className={"flex-col items-start"}>
                <p>About you<span className={"text-red-500"}>*</span></p>
                <p className={"font-normal"}>Briefly describe your professional background, emphasising any experiences, roles, or research you have had in the field of education. (max 2000 characters)</p>
              </FieldLabel>
              <Textarea
                  id="aboutYou"
                  placeholder=""
                  className={"min-h-40"}
                  aria-required
                  {...form.register("aboutYou")}
              />
              <FieldError>{form.formState.errors.aboutYou?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="topics" className={"flex-col items-start"}>
                <p>Topics<span className={"text-red-500"}>*</span></p>
                <p className={"font-normal"}>What topics are you mostly interested in within the area of CS Education? (max 2000 characters)</p>
              </FieldLabel>
              <Textarea
                  id="topics"
                  placeholder=""
                  className={"min-h-40"}
                  aria-required
                  {...form.register("topics")}
              />
              <FieldError>{form.formState.errors.topics?.message}</FieldError>
            </Field>

            <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Submitting..." : "Submit"}</Button>
          </form>
        </Form>}
      </div>

  )
}