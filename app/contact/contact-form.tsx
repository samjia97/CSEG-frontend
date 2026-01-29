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
import {
  Field,
  FieldLabel,
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
import {Form} from "@/components/ui/form";
import {useState} from "react";
import {createContactMessage} from "@/app/contact/api/create-contact-message";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string(),
  subject: z.string().min(1).max(2000),
  message: z.string().max(2000)
});

export type ContactFormData = z.infer<typeof formSchema>

const SuccessMessage = () => (
    <div className={"flex justify-center"}>
      <div className="py-4 w-full max-w-5xl bg-green-100 text-green-800 rounded-md text-center">
        <h4>Thank you for contacting CSEG</h4>
        <p>We will get in touch by email soon</p>
      </div>
    </div>
)
const FailureMessage = () => (
    <div className={"flex justify-center"}>
      <div className="py-4 w-full max-w-5xl bg-red-100 text-red-800 rounded-md text-center">
        <h4>We encountered a server error handling your request</h4>
        <p>Please try again after a few hours or contact us at cseg@ed.ac.uk</p>
      </div>
    </div>
)

export default function ContactForm() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
  })
  const [submissionError, setSubmissionError] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      await createContactMessage(values)
      setSubmissionError(false);
      setSubmissionSuccess(true);
    } catch (error) {
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
      <>
        {submissionSuccess ? <SuccessMessage /> : null}
        {submissionError ? <FailureMessage /> : null}
        {!submissionSuccess &&
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">
          <Field>
            <FieldLabel htmlFor="name" className={"flex-col items-start"}>
              <p>Name<span className={"text-red-500"}>*</span></p>
              <p className={"font-normal"}>Max 100 characters</p>
            </FieldLabel>
            <Input
                id="name"
                placeholder=""

                {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email<span className={"text-red-500"}>*</span></FieldLabel>
            <Input
                id="email"
                placeholder=""

                {...form.register("email")}
            />

            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="subject" className={"flex-col items-start"}>
              <p>Subject<span className={"text-red-500"}>*</span></p>
              <p className={"font-normal"}>Max 2000 characters</p>
            </FieldLabel>
            <Input
                id="subject"
                placeholder=""

                {...form.register("subject")}
            />

            <FieldError>{form.formState.errors.subject?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="message" className={"flex-col items-start"}>
              <p>Message<span className={"text-red-500"}>*</span></p>
              <p className={"font-normal"}>Max 2000 characters</p>
            </FieldLabel>
            <Textarea
                id="message"
                placeholder=""
                className={"min-h-40"}

                {...form.register("message")}
            />
            <FieldError>{form.formState.errors.message?.message}</FieldError>
          </Field>
          <Button type="submit">Submit</Button>
        </form>
      </Form>}
      </>

  )
}