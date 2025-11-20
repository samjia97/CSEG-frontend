import React from 'react'
import {getResearchProjects} from "@/app/research/api/get-research-projects";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import LearnMore from "@/app/research/learn-more";

function ResearchPageHeader() {
  return <>
    <Breadcrumb className={"bg-neutral-200 px-8"}>
      <BreadcrumbList className={"text-lg"}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        <BreadcrumbItem>
          <BreadcrumbPage>Research</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div className={"flex flex-col text-center mt-4 px-4"}>
      <h1 className={"text-5xl mb-4"}>Research projects</h1>
      <p>Explore our research projects in the field of Computer Science Education. Created from
        collaboration between multiple CSEG members.</p>
    </div>
  </>;
}

async function ResearchProjectsPage() {
  const researchProjects = await getResearchProjects();
  if (researchProjects === null) {
    return (
        <main className={"min-h-screen bg-neutral-50 pt-2 px-4"}>
          <ResearchPageHeader/>
          <div className={"flex justify-center mt-8"}>
            <div
                className={"text-center border-8 rounded-xl border-red-400 bg-red-50 w-[500px] h-[100px] flex"}>
              <h2 className={"text-xl"}>Server error encountered. Unable to load research projects.
                Please try again another time</h2>
            </div>
          </div>
        </main>

    )
  }
  return (
      <main className={"min-h-screen bg-neutral-50 pt-2 px-4"}>
        <ResearchPageHeader/>
        <div className={"flex justify-center px-4"}>
          <div className={"flex flex-col w-full max-w-7xl items-left mt-8 gap-8"}>
            {researchProjects.map(project => {

              return (
                  <article key={project.documentId} className={"bg-neutral-100 pb-2"}>
                    <div className={"bg-secondary p-2"}>
                      <Link href={`/research/${project.slug}`}
                            className={"text-xl text-secondary-foreground bg-secondary underline"}>
                        <h3>{project.title}</h3>
                      </Link>
                    </div>
                    <div className={"px-2"}>
                    <p><strong>Completion
                      Date: </strong>{project.projectEndDate === null ? 'N/A - Ongoing project' : formatDate(project.projectEndDate)}
                    </p>
                    <p><strong>Summary: </strong>{project.shortSummary}</p>
                    <LearnMore projectEndDate={project.projectEndDate}
                               longSummaryOnLearnMore={project.longSummaryOnLearnMore}
                               primaryInvestigator={project.primaryInvestigator}
                               coInvestigator={project.coInvestigator}/>
                    </div>
                  </article>)
            })}


          </div>
        </div>


      </main>
  )
}

export default ResearchProjectsPage
