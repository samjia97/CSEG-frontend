import React from 'react'
import InteractivePublications from "@/app/publications/interactivePublications";
import {getPublications, Publication} from "@/app/publications/api/get-publications";
import {getTopics} from "@/lib/get-topics";

async function PublicationsPage() {
  let publications: Publication[] = [];
  let topics: string[] = [];
  try {
    publications = await getPublications();
    topics = await getTopics();
  } catch (e) {
    console.error(e);
    return (
        <main className={"p-4 flex flex-col items-center gap-4"}>
          <div>
            <h1 className={"text-center"}>Publications</h1>
            <p>Research papers, presentations, posters and other types of content</p>
          </div>
          <div className={"bg-red-100 text-red-800 rounded-md text-center py-4 w-full max-w-5xl"}>
            <p>We experienced a server error loading publications. Please try again some other time.</p>
          </div>
        </main>
    )
  }
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
