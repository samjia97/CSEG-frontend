import type { Metadata } from 'next';
import React from 'react'
import InteractivePublications from "@/app/publications/interactivePublications";
import {getPublications} from "@/app/publications/api/get-publications";
import {getTopics} from "@/lib/get-topics";

async function PublicationsPage() {
  const publications = await getPublications();
  const topics = await getTopics();

  return (
      <>
        <div className={"mb-4"}>
          <h2 className={"text-center bg-amber-500/70 rounded-md mb-2"}>Publications</h2>
          <p>Research papers, presentations, posters and other types of content</p>
        </div>
        <InteractivePublications initialPublications={publications} topics={topics}/>
      </>
  )
}

export default PublicationsPage
export const metadata = {
  title:"Publications"
}