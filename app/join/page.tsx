import React from 'react'
import MyForm from "@/app/join/join-form";

function JoinPage() {
  return (
      <>
          <h1 className={"text-center"}>Join the CSE Group</h1>
        <div className={"max-w-4xl mx-auto"}>
          <p className={"text-lg"}>Get Involved – Join us in sharing knowledge and practice, inspiring and shaping the future of Computer Science Education! The CSE Group welcomes individuals from all disciplines who are passionate about Computer Science Education.</p>
          <p>These information will only be used for moderation,
              and  will not be published without your permission.</p>
        <MyForm/>

        </div>
      </>
      // <main className={"px-4 py-4 flex flex-col mx-auto max-w-4xl gap-2"}>
      // </main>
  )
}

export default JoinPage
