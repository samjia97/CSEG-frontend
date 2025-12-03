import React from 'react'
import MyForm from "@/app/join/join-form";

function JoinPage() {
  return (
      <main className={"px-4 py-4 flex flex-col mx-auto max-w-4xl gap-2"}>
          <h1 className={"text-center"}>Join the CSE Group</h1>
          <p className={"text-lg"}>Get Involved – Join us in sharing knowledge and practice, inspiring and shaping the future of Computer Science Education! The CSE group welcomes individuals from all disciplines who are passionate about Computer Science Education.</p>
          <p>To become a member, please register using the following form.</p>
        <MyForm/>
      </main>
  )
}

export default JoinPage
