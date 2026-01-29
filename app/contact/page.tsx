import React from 'react'
import ContactForm from "@/app/contact/contact-form";
import Link from "next/link";

function ContactPage() {
  return (
      <>
        <div className={"flex flex-col text-center mb-4"}>
          <h1>Contact us</h1>
        </div>
        <div className={"max-w-4xl text-lg mx-auto"}>
          <span>Would you like to become a member of the CSE Group?
            If so, please fill in the form from the ‘Join the CSE Group!’ page. <Link href={"/join"} className={"text-primary"}>Join the CSE Group</Link></span>
          <ContactForm/>
        </div>
      </>
  )
}

export default ContactPage;
