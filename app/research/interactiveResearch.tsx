"use client"
import React, { useMemo, useState } from 'react';
import { ResearchProject } from "@/app/research/api/get-research-projects";
import { formatDate } from "@/lib/formatters";
import Link from "next/link";
import { ResearchFilterPanel } from "@/app/research/ResearchFilterPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2 } from "lucide-react";
import { defaultStartYear, PAGE_SIZE, thisYear, ProjectStatus, defaultStatus } from "@/app/research/research_constants";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination";
import LearnMore from "@/app/research/learn-more";

type InteractiveResearchProps = {
  initialProjects: ResearchProject[];
};

const validateAgainstQuery = (project: ResearchProject, query: string): boolean => {
  return (
    project.title.toLowerCase().includes(query) ||
    project.primaryInvestigator.toLowerCase().includes(query) ||
    (project.coInvestigator?.toLowerCase() || "").includes(query) ||
    project.summary.toLowerCase().includes(query)
  );
};

const matchesStatus = (project: ResearchProject, status: ProjectStatus): boolean => {
  if (status === 'all') return true;
  if (status === 'ongoing') {
    return project.ongoingProject || project.projectEndDate === null;
  }
  return !project.ongoingProject && project.projectEndDate !== null;
};

const NoProjectsToShow = () => {
  return (
    <div className="py-4 w-full max-w-5xl bg-accent text-accent-foreground rounded-md text-center">
      <h4>No research projects to show</h4>
      <p>Please change your filter / search settings</p>
    </div>
  );
};

function InteractiveResearch({ initialProjects }: InteractiveResearchProps) {
  const [startYear, setStartYearState] = useState(defaultStartYear);
  const [endYear, setEndYearState] = useState(String(thisYear));
  const [projectStatus, setProjectStatusState] = useState<ProjectStatus>(defaultStatus);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const setStartYear: typeof setStartYearState = (value) => {
    setStartYearState(value);
    setPage(1);
  };
  const setEndYear: typeof setEndYearState = (value) => {
    setEndYearState(value);
    setPage(1);
  };
  const setProjectStatus: typeof setProjectStatusState = (value) => {
    setProjectStatusState(value);
    setPage(1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString() ?? '';
    setSearchQuery(query.toLowerCase());
    setPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setStartYearState(defaultStartYear);
    setEndYearState(String(thisYear));
    setProjectStatusState(defaultStatus);
    setPage(1);
  };

  const filteredProjects = useMemo(() => {
    const endYearDate = new Date(parseInt(endYear, 10), 11, 31);
    const startYearDate = new Date(parseInt(startYear, 10), 0, 1);

    return initialProjects.filter((project) =>
      project.projectStartDate <= endYearDate &&
      project.projectStartDate >= startYearDate &&
      matchesStatus(project, projectStatus) &&
      validateAgainstQuery(project, searchQuery)
    );
  }, [initialProjects, endYear, startYear, searchQuery, projectStatus]);

  const maxPage = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const paginatedProjects = filteredProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={`grid gap-4 ${isFilterOpen ? 'grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
      {isFilterOpen && (
        <ResearchFilterPanel
          startYear={startYear}
          setStartYear={setStartYear}
          endYear={endYear}
          setEndYear={setEndYear}
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
        />
      )}

      <div>
        <form className="flex gap-2 w-full items-center" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="search"
            placeholder="search in title, investigators, summary"
            className="flex-1 max-w-[350px] rounded-none focus-visible:ring-0"
          />
          <Button type="submit" aria-label="Submit" size="icon">
            <Search />
          </Button>
          <Button type="reset" variant="destructive" onClick={handleClearAll}>
            CLEAR
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-label={isFilterOpen ? "Hide filters" : "Show filters"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Settings2 />
            Filters
          </Button>
        </form>

        <div className="mt-3 mb-3 flex flex-col gap-4">
          {paginatedProjects.length === 0 ? (
            <NoProjectsToShow />
          ) : (
            paginatedProjects.map((project) => (
              <article key={project.documentId} className="bg-neutral-100 pb-2 px-2">
                  <Link
                    href={`/research/${project.slug}`}
                    className="text-secondary underline"
                  >
                    <h3>{project.title}</h3>
                  </Link>
                <div className="grid grid-cols-[200px_1fr]">
                  <strong>Start date</strong>
                  <p>{formatDate(project.projectStartDate)}</p>
                  <strong>End date</strong>
                  <p>{project.projectEndDate === null ? 'Ongoing project' : formatDate(project.projectEndDate)}</p>
                  <strong>Primary investigator</strong>
                  <p>{project.primaryInvestigator}</p>
                  <strong>Co-investigator(s)</strong>
                  <p>{project.coInvestigator}</p>
                </div>
                <LearnMore summary={project.summary} />
              </article>
            ))
          )}
        </div>

        {maxPage > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationClientPrevious onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>
              {Array.from({ length: maxPage }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationClientLink
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationClientLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationClientNext onClick={() => setPage(Math.min(maxPage, page + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default InteractiveResearch;
