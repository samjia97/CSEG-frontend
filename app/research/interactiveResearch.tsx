"use client"
import React, { useMemo, useState } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ResearchProject } from "@/app/research/api/get-research-projects";
import { formatDate } from "@/lib/formatters";
import { ResearchFilterPanel } from "@/app/research/ResearchFilterPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LearnMore from "@/app/research/learn-more";
import SearchBar from "@/app/events/searchBar";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  defaultEndYear,
  defaultStartYear,
  defaultStatus,
  PAGE_SIZE,
  ProjectStatus,
  ProjectStatusSchema,
  YearSchema,
} from "@/app/research/research_constants";

type InteractiveResearchProps = {
  initialProjects: ResearchProject[];
  topics: string[];
};

const matchesQuery = (project: ResearchProject, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    project.title.toLowerCase().includes(q) ||
    project.primaryInvestigator.toLowerCase().includes(q) ||
    (project.coInvestigator?.toLowerCase() ?? "").includes(q) ||
    project.summary.toLowerCase().includes(q)
  );
};

const matchesStatus = (project: ResearchProject, status: ProjectStatus): boolean => {
  if (status === 'all') return true;
  if (status === 'ongoing') return project.ongoingProject || project.projectEndDate === null;
  return !project.ongoingProject && project.projectEndDate !== null;
};

const matchesTopics = (project: ResearchProject, selectedTopics: Set<string>): boolean => {
  if (selectedTopics.size === 0) return true;
  return project.researchTopics.some((t) => selectedTopics.has(t));
};

const NoProjectsToShow = () => (
  <div className="py-4 w-full max-w-5xl bg-accent text-accent-foreground rounded-md text-center">
    <h4>No research projects to show</h4>
    <p>Please change your filter / search settings</p>
  </div>
);

/**
 * Client-side interactive research with filtering, search, and pagination.
 * All filter state is stored in URL search params so it survives navigation.
 */
function InteractiveResearch({ initialProjects, topics }: InteractiveResearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- Read ALL filter state from URL with Zod validation ----
  const startYearResult = YearSchema.safeParse(searchParams.get("startYear"));
  const startYear = startYearResult.success ? startYearResult.data : defaultStartYear;

  const endYearResult = YearSchema.safeParse(searchParams.get("endYear"));
  const endYear = endYearResult.success ? endYearResult.data : defaultEndYear;

  const statusResult = ProjectStatusSchema.safeParse(searchParams.get("status"));
  const projectStatus: ProjectStatus = statusResult.success ? statusResult.data : defaultStatus;

  const topicsParam = searchParams.get("topics") ?? "";
  const selectedTopics = new Set<string>(
    topicsParam ? topicsParam.split(",").filter((t) => topics.includes(t)) : []
  );

  const searchQuery = searchParams.get("query") ?? "";

  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // UI-only state (doesn't need to persist in URL)
  const [isFilterOpen] = useState(true);

  // ---- Helper: update URL search params ----
  // Pass the params you want to change. null/empty removes the param.
  // Automatically resets page to 1 unless you're changing page itself.
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    if (!("page" in updates)) params.delete("page");
    router.replace(`/research?${params.toString()}`);
  };

  // ---- Client-side filtering with useMemo for performance ----
  const filteredProjects = useMemo(() => {
    const startDate = new Date(parseInt(startYear, 10), 0, 1);
    const endDate = new Date(parseInt(endYear, 10), 11, 31);
    return initialProjects.filter((p) =>
      p.projectStartDate >= startDate &&
      p.projectStartDate <= endDate &&
      matchesStatus(p, projectStatus) &&
      matchesTopics(p, selectedTopics) &&
      matchesQuery(p, searchQuery)
    );
  }, [initialProjects, startYear, endYear, projectStatus, selectedTopics, searchQuery]);

  const maxPage = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const paginatedProjects = filteredProjects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ---- Handlers ----
  const handleSearch = (query: string) => updateParams({ query: query || null });
  const handleClearAll = () => router.replace("/research");

  return (
    <div className={`grid gap-4 ${isFilterOpen ? 'grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
      {isFilterOpen && (
        <ResearchFilterPanel
          startYear={startYear}
          endYear={endYear}
          projectStatus={projectStatus}
          topics={topics}
          selectedTopics={selectedTopics}
          updateParams={updateParams}
        />
      )}

      <div>
        <div className="flex gap-2 w-full items-center">
          <SearchBar onSearch={handleSearch} />
          <Button type="button" variant="destructive" onClick={handleClearAll}>
            CLEAR
          </Button>
        </div>

        <div className="mt-3 mb-3 flex flex-col gap-4">
          {paginatedProjects.length === 0 ? (
            <NoProjectsToShow />
          ) : (
            paginatedProjects.map((project) => (
              <article key={project.documentId} className="bg-neutral-100 pb-2 px-2 max-w-4xl">
                <Link href={`/research/${project.slug}`} className="text-secondary underline">
                  <h3>{project.title}</h3>
                </Link>
                <div className="grid grid-cols-[200px_1fr]">
                  <strong>Start date</strong>
                  <p>{formatDate(project.projectStartDate)}</p>
                  <strong>End date</strong>
                  <p>{project.projectEndDate === null ? 'Ongoing project' : formatDate(project.projectEndDate)}</p>
                  <strong>Primary investigator</strong>
                  <p>{project.primaryInvestigator}</p>
                  {project.coInvestigator && (
                    <>
                      <strong>Co-investigator(s)</strong>
                      <p>{project.coInvestigator}</p>
                    </>
                  )}
                  {project.researchTopics.length > 0 && (
                    <>
                      <strong className="pt-1">Topics</strong>
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {project.researchTopics.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                      </div>
                    </>
                  )}
                </div>
                <LearnMore summary={project.summary} />
              </article>
            ))
          )}
        </div>

        {/* Pagination - uses router.push so back button returns to previous page */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationClientPrevious onClick={() => {
                if (safePage > 1) {
                  const params = new URLSearchParams(searchParams.toString());
                  if (safePage - 1 === 1) params.delete("page");
                  else params.set("page", String(safePage - 1));
                  router.push(`/research?${params.toString()}`);
                }
              }} />
            </PaginationItem>
            {Array.from({ length: maxPage }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationClientLink
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (i + 1 === 1) params.delete("page");
                    else params.set("page", String(i + 1));
                    router.push(`/research?${params.toString()}`);
                  }}
                  isActive={safePage === i + 1}
                >
                  {i + 1}
                </PaginationClientLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationClientNext onClick={() => {
                if (safePage < maxPage) {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(safePage + 1));
                  router.push(`/research?${params.toString()}`);
                }
              }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default InteractiveResearch;
