import React from 'react'
import { getResearchProjects } from "@/app/research/api/get-research-projects";
import InteractiveResearch from "@/app/research/interactiveResearch";
import {getTopics} from "@/lib/get-topics";

function ResearchPageHeader() {
  return (
    <div className="flex flex-col text-center mb-4">
      <h2 className="mb-4 bg-violet-500/70 rounded-md">Research projects</h2>
      <p>Explore our research projects in the field of Computer Science Education. Created from
        collaboration between multiple CSEG members.</p>
    </div>
  );
}

async function ResearchProjectsPage() {
  const researchProjects = await getResearchProjects();
  const topics = await getTopics();

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center">
      <ResearchPageHeader />
      <div className="mt-4 max-w-7xl w-full">
        <InteractiveResearch initialProjects={researchProjects} topics={topics} />
      </div>
    </main>
  );
}

export default ResearchProjectsPage
