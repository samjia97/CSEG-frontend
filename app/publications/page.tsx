import React from 'react'
import InteractivePublications from "@/app/publications/interactivePublications";
import {getPublications} from "@/app/publications/api/get-publications";

async function PublicationsPage() {
  const publications = await getPublications();
  console.log(publications)
  return (
      <main className={"p-4 flex flex-col items-center"}>
        <div>
          <h1 className={"text-center"}>Publications</h1>
          <p>Research papers, presentations, posters and other types of content</p>
        </div>
        <InteractivePublications publications={publications}/>

      </main>
  )
}

export default PublicationsPage
