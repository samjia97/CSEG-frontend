import React from 'react'
import InteractivePublications from "@/app/publications/interactivePublications";
import {getPublications} from "@/app/publications/api/get-publications";
import {getTopics} from "@/lib/get-topics";

async function PublicationsPage() {
  const publications = await getPublications();
  const topics = await getTopics();
  return (
      <main className={"p-4 flex flex-col items-center gap-4"}>
        <div>
          <h1 className={"text-center"}>Publications</h1>
          <p>Research papers, presentations, posters and other types of content</p>
        </div>
        <InteractivePublications initialPublications={publications} topics={topics}/>

      </main>
  )
}

export default PublicationsPage
