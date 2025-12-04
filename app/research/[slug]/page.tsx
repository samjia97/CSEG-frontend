import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {getResearchProject} from "@/app/research/[slug]/get-research-project";
import {getDocumentIdFromSlug} from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {formatDate} from "@/lib/formatters";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import Image from "next/image";
import {getStrapiImageUrl} from "@/lib/api";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ slug: string }>
}) {
  const {slug} = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const researchProjectData = await getResearchProject(documentId);
  if (!researchProjectData) {
    return (<main className={"p-4 flex flex-col items-center bg-neutral-50 min-h-80 gap-8"}>
      <h2 className={"text-2xl"}>Research Project Not Found</h2>
      <p>The research project you are looking for does not exist or has been removed.</p>
      <Button asChild>
        <Link href={"/research"}>Back to research projects</Link>
      </Button>
    </main>)
  }

  return <main className={"p-4 flex flex-col items-center bg-neutral-50"}>
    <div className={"flex gap-4 self-start"}>
      <Button asChild>
        <Link href={"/research"}>Back to research</Link>
      </Button>
      <Breadcrumb className={"bg-neutral-200 px-2"}>
        <BreadcrumbList className={"flex items-center"}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbLink href="/research">Research</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage
                className={"truncate max-w-[600px]"}>{researchProjectData.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    {/*<article className={"flex flex-col items-center gap-2  max-w-[1168px]"}>*/}
    {/*  <h1 className={"text-3xl bg-secondary text-secondary-foreground p-2"}>{researchProjectData.title}</h1>*/}
    {/*  /!*Two columns of research project metadata*!/*/}
    {/*  <div className={"grid lg:grid-cols-[2fr_1fr] gap-1 w-full border-primary rounded-md border-2 px-2"}>*/}
    {/*    /!*Side by side text*!/*/}
    {/*    <div className={"grid grid-cols-[200px_1fr] gap-1"}>*/}
    {/*      <strong>Primary investigator:</strong>*/}
    {/*      <div>{researchProjectData.primaryInvestigator}</div>*/}
    {/*      <strong>Email:</strong>*/}
    {/*      <div>{researchProjectData.primaryInvestigatorEmail}</div>*/}
    {/*      {researchProjectData.coInvestigator &&*/}
    {/*          <>*/}
    {/*            <strong>Co-investigator:</strong>*/}
    {/*            <div>{researchProjectData.coInvestigator}</div>*/}
    {/*            {researchProjectData.coInvestigatorEmail &&*/}
    {/*                <>*/}
    {/*                  <strong>Co-investigator email:</strong>*/}
    {/*                  <div>{researchProjectData.coInvestigatorEmail}</div>*/}
    {/*                </>*/}
    {/*            }*/}
    {/*          </>*/}
    {/*      }*/}
    {/*    </div>*/}
    {/*    /!* Second column of metadata*!/*/}
    {/*    <div className={"grid grid-cols-[200px_1fr] gap-2"}>*/}
    {/*      <strong>Start date:</strong>*/}
    {/*      <div>{formatDate(researchProjectData.projectStartDate)}</div>*/}
    {/*      <strong>Ongoing project:</strong>*/}
    {/*      <div>{researchProjectData.ongoingProject ? "Yes" : "No"}</div>*/}
    {/*      <strong>Completion date:</strong>*/}
    {/*      <div>{researchProjectData.ongoingProject || !researchProjectData.projectEndDate ? "Ongoing" : formatDate(researchProjectData.projectEndDate)}</div>*/}
    {/*    </div>*/}
    {/*    <div className={"grid-span-2"}>*/}
    {/*      TOPICS: PLACEHOLDER*/}
    {/*    </div>*/}
    {/*  </div>*/}
    {/*  {researchProjectData.projectPageCoverImage &&*/}
    {/*      <Image*/}
    {/*          src={getStrapiImageUrl(researchProjectData.projectPageCoverImage.url)}*/}
    {/*          alt={researchProjectData.projectPageCoverImage.alternativeText ?? ""}*/}
    {/*          width={researchProjectData.projectPageCoverImage.width}*/}
    {/*          height={researchProjectData.projectPageCoverImage.height}*/}
    {/*          sizes="(max-width: 768px) 100vw, 750px"*/}
    {/*          className="max-w-[750px] w-full h-auto"*/}
    {/*      />}*/}
    {/*      <BlocksRenderer content={researchProjectData.projectPageContent}/>*/}
    {/*    </article>*/}
    {/*<article className={"flex flex-col items-center gap-2 max-w-[1168px]"}>*/}
    {/*  <h1 className={"text-3xl bg-secondary text-secondary-foreground p-2"}>{researchProjectData.title}</h1>*/}

    {/*  /!* Image and metadata side by side *!/*/}
    {/*  <div className={"grid lg:grid-cols-[3fr_2fr] gap-4 w-full"}>*/}
    {/*    /!* Image on left *!/*/}
    {/*    {researchProjectData.projectPageCoverImage &&*/}
    {/*        <Image*/}
    {/*            src={getStrapiImageUrl(researchProjectData.projectPageCoverImage.url)}*/}
    {/*            alt={researchProjectData.projectPageCoverImage.alternativeText ?? ""}*/}
    {/*            width={researchProjectData.projectPageCoverImage.width}*/}
    {/*            height={researchProjectData.projectPageCoverImage.height}*/}
    {/*            sizes="(max-height: 800px) 100vw, 50vw"*/}
    {/*            className="object-contain"*/}
    {/*        />*/}
    {/*    }*/}

    {/*    /!* Metadata on right *!/*/}
    {/*    <div className={"border-primary rounded-md border-2 p-4 flex flex-col gap-2"}>*/}
    {/*      <div className={"grid grid-cols-[180px_1fr] gap-1"}>*/}
    {/*        <strong>Primary investigator:</strong>*/}
    {/*        <div>{researchProjectData.primaryInvestigator}</div>*/}

    {/*        <strong>Email:</strong>*/}
    {/*        <div>{researchProjectData.primaryInvestigatorEmail}</div>*/}

    {/*        {researchProjectData.coInvestigator &&*/}
    {/*            <>*/}
    {/*              <strong>Co-investigator:</strong>*/}
    {/*              <div>{researchProjectData.coInvestigator}</div>*/}
    {/*              {researchProjectData.coInvestigatorEmail &&*/}
    {/*                  <>*/}
    {/*                    <strong>Co-investigator email:</strong>*/}
    {/*                    <div>{researchProjectData.coInvestigatorEmail}</div>*/}
    {/*                  </>*/}
    {/*              }*/}
    {/*            </>*/}
    {/*        }*/}

    {/*        <strong>Start date:</strong>*/}
    {/*        <div>{formatDate(researchProjectData.projectStartDate)}</div>*/}

    {/*        <strong>Ongoing project:</strong>*/}
    {/*        <div>{researchProjectData.ongoingProject ? "Yes" : "No"}</div>*/}

    {/*        <strong>Completion date:</strong>*/}
    {/*        <div>{researchProjectData.ongoingProject || !researchProjectData.projectEndDate ? "Ongoing" : formatDate(researchProjectData.projectEndDate)}</div>*/}
    {/*      </div>*/}

    {/*      <div>TOPICS: PLACEHOLDER</div>*/}
    {/*    </div>*/}
    {/*  </div>*/}

    {/*  <BlocksRenderer content={researchProjectData.projectPageContent}/>*/}
    {/*</article>*/}
    {/*<article className={"flex flex-col items-center gap-4 max-w-[1168px]"}>*/}
    {/*  <h1 className={"text-3xl bg-secondary text-secondary-foreground p-2"}>{researchProjectData.title}</h1>*/}

    {/*  /!* Image and metadata side by side on large screens *!/*/}
    {/*  <div className={"flex flex-col lg:flex-row gap-4 w-full"}>*/}
    {/*    /!* Image on left - capped height *!/*/}
    {/*    {researchProjectData.projectPageCoverImage &&*/}
    {/*        <div className={"flex-1 min-w-0"}>*/}
    {/*          <Image*/}
    {/*              src={getStrapiImageUrl(researchProjectData.projectPageCoverImage.url)}*/}
    {/*              alt={researchProjectData.projectPageCoverImage.alternativeText ?? ""}*/}
    {/*              width={researchProjectData.projectPageCoverImage.width}*/}
    {/*              height={researchProjectData.projectPageCoverImage.height}*/}
    {/*              sizes="(max-width: 1024px) 100vw, 60vw"*/}
    {/*              className="object-contain max-h-[380px] w-auto"*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*    }*/}

    {/*    /!* Metadata on right - fixed width on large screens *!/*/}
    {/*    <div className={"w-full lg:w-[320px] lg:flex-shrink-0 border-primary rounded-md border-2 p-4"}>*/}
    {/*      <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4"}>*/}
    {/*        <div className={"flex flex-col"}>*/}
    {/*          <span className={"text-sm font-semibold text-muted-foreground"}>Primary investigator</span>*/}
    {/*          <span>{researchProjectData.primaryInvestigator}</span>*/}
    {/*        </div>*/}

    {/*        <div className={"flex flex-col"}>*/}
    {/*          <span className={"text-sm font-semibold text-muted-foreground"}>Email</span>*/}
    {/*          <span className={"break-all"}>{researchProjectData.primaryInvestigatorEmail}</span>*/}
    {/*        </div>*/}

    {/*        {researchProjectData.coInvestigator &&*/}
    {/*            <div className={"flex flex-col"}>*/}
    {/*              <span className={"text-sm font-semibold text-muted-foreground"}>Co-investigator</span>*/}
    {/*              <span>{researchProjectData.coInvestigator}</span>*/}
    {/*            </div>*/}
    {/*        }*/}

    {/*        {researchProjectData.coInvestigatorEmail &&*/}
    {/*            <div className={"flex flex-col"}>*/}
    {/*              <span className={"text-sm font-semibold text-muted-foreground"}>Co-investigator email</span>*/}
    {/*              <span className={"break-all"}>{researchProjectData.coInvestigatorEmail}</span>*/}
    {/*            </div>*/}
    {/*        }*/}

    {/*        <div className={"flex flex-col"}>*/}
    {/*          <span className={"text-sm font-semibold text-muted-foreground"}>Start date</span>*/}
    {/*          <span>{formatDate(researchProjectData.projectStartDate)}</span>*/}
    {/*        </div>*/}

    {/*        <div className={"flex flex-col"}>*/}
    {/*          <span className={"text-sm font-semibold text-muted-foreground"}>Ongoing project</span>*/}
    {/*          <span>{researchProjectData.ongoingProject ? "Yes" : "No"}</span>*/}
    {/*        </div>*/}

    {/*        <div className={"flex flex-col"}>*/}
    {/*          <span className={"text-sm font-semibold text-muted-foreground"}>Completion date</span>*/}
    {/*          <span>{researchProjectData.ongoingProject || !researchProjectData.projectEndDate ? "Ongoing" : formatDate(researchProjectData.projectEndDate)}</span>*/}
    {/*        </div>*/}
    {/*      </div>*/}

    {/*      <div className={"mt-4 pt-4 border-t"}>*/}
    {/*        <span className={"text-sm font-semibold text-muted-foreground"}>Topics</span>*/}
    {/*        <div>PLACEHOLDER</div>*/}
    {/*      </div>*/}
    {/*    </div>*/}
    {/*  </div>*/}

    {/*  <div className={"w-full prose prose-lg max-w-none"}>*/}
    {/*    <BlocksRenderer content={researchProjectData.projectPageContent}/>*/}
    {/*  </div>*/}
    {/*</article>*/}
    <article className={"flex flex-col items-center max-w-[1168px] w-full"}>
      <h2 className={"my-2"}>{researchProjectData.title}</h2>

      {/* Image and metadata side by side on large screens */}
      <div className={"flex"}>
        {/* Image on left - capped height */}
        {researchProjectData.projectPageCoverImage &&
            <div className={"flex-1 min-w-0"}>
              <Image
                  src={getStrapiImageUrl(researchProjectData.projectPageCoverImage.url)}
                  alt={researchProjectData.projectPageCoverImage.alternativeText ?? ""}
                  width={researchProjectData.projectPageCoverImage.width}
                  height={researchProjectData.projectPageCoverImage.height}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain max-h-[300px] w-auto"
              />
            </div>
        }

        {/* Metadata on right - fixed width on large screens */}
      <hr/>
      </div>

      <div className={"w-full prose max-w-none self-start"}>
        <BlocksRenderer content={researchProjectData.projectPageContent}/>
      </div>
        <div
            className={"w-full lg:w-[550px] lg:flex-shrink-0 self-start border-primary rounded-md border-2 p-2 mt-2"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex justify-between gap-2"}>
              <span className={"font-semibold"}>Primary investigator</span>
              <span className={"text-right"}>{researchProjectData.primaryInvestigator}</span>
            </div>

            <div className={"flex justify-between gap-2"}>
              <span className={"font-semibold"}>Email</span>
              <span
                  className={"text-right break-all"}>{researchProjectData.primaryInvestigatorEmail}</span>
            </div>

            {researchProjectData.coInvestigator &&
                <div className={"flex justify-between gap-2"}>
                  <span className={"font-semibold"}>Co-investigator</span>
                  <span className={"text-right"}>{researchProjectData.coInvestigator}</span>
                </div>
            }

            {researchProjectData.coInvestigatorEmail &&
                <div className={"flex justify-between gap-2"}>
                  <span className={"font-semibold"}>Co-investigator email</span>
                  <span
                      className={"text-right break-all"}>{researchProjectData.coInvestigatorEmail}</span>
                </div>
            }

            <div className={"flex justify-between gap-2"}>
              <span className={"font-semibold"}>Start date</span>
              <span
                  className={"text-right"}>{formatDate(researchProjectData.projectStartDate)}</span>
            </div>

            <div className={"flex justify-between gap-2"}>
              <span className={"font-semibold"}>Completion date</span>
              <span
                  className={"text-right"}>{researchProjectData.ongoingProject || !researchProjectData.projectEndDate ? "Ongoing project" : formatDate(researchProjectData.projectEndDate)}</span>
            </div>

            <hr className={"my-1"}/>

            <div className={"flex justify-between gap-2"}>
              <span className={"font-semibold"}>Topics</span>
              <span className={"text-right"}>PLACEHOLDER</span>
            </div>
          </div>
        </div>
    </article>
  </main>
}

