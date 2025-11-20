import React from 'react'

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ slug: string }>
}) {
  const {slug} = await params;

  return <main className={"p-4 flex flex-col items-center bg-neutral-50"}>
    <div className={"flex gap-4 self-start mb-4"}>
      <h1>Research Project: {slug}</h1>
    </div>
  </main>
}

