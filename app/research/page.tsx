import React from 'react'
import { getResearchProjects } from "@/app/research/api/get-research-projects";
import InteractiveResearch from "@/app/research/interactiveResearch";

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

  if (researchProjects === null) {
    return (
      <main className="min-h-screen bg-neutral-50 pt-2 px-4">
        <ResearchPageHeader />
        <div className="flex justify-center mt-8">
          <div className="text-center border-8 rounded-xl border-red-400 bg-red-50 w-[500px] h-[100px] flex items-center justify-center">
            <h2 className="text-xl">Server error encountered. Unable to load research projects.
              Please try again another time</h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center">
      <ResearchPageHeader />
      <div className="mt-4 max-w-7xl w-full">
        <InteractiveResearch initialProjects={researchProjects} />
      </div>
    </main>
  );
}

export default ResearchProjectsPage
