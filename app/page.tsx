import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"
import {getHomepage} from "@/app/get-homepage";
import {getStrapiImageUrl} from "@/lib/api";
import {Card, CardAction, CardContent} from "@/components/ui/card";
import {StyledMarkdown} from "@/components/custom/StyledMarkdown";

interface HomepageCardProps {
  url: string;
  alternativeText: string;
  titleText: string;
  bodyText: string;
  buttonText: string;
  buttonHref: string;
}

function HomepageCard({ url, alternativeText, titleText, bodyText, buttonText, buttonHref }: HomepageCardProps) {
  return (
    <Card className={"p-0 rounded-none max-w-[400px] max-h-[400px] box-border flex gap-2"}>
      <Image
        src={getStrapiImageUrl(url)}
        alt={alternativeText}
        width={400}
        height={200}
        className={"h-[200px]"}
      />
      {/*Problem is h-full attempts to take 100% of parent - 400 px*/}
      <div className={"border-b-4 border-primary flex flex-col justify-between flex-1 "}>
        <CardContent>
            <h3 className={"text-2xl"}>{titleText}</h3>
            <p>{bodyText}</p>
        </CardContent>
        <CardAction className={"flex justify-center w-full pb-4"}>
          <Button asChild>
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </CardAction>
      </div>
    </Card>
  );
}

export default async function Home() {
  const homepageData = await getHomepage();
  if (homepageData === undefined){
    return (<div>
      <p>Sorry, we are experiencing technical issues. Please come back later</p>
    </div>)
  }

  return (
      <>
      <main className="w-full pt-4 px-4">
        <div className={"w-full flex flex-col items-center"}>
          <Link className={"text-2xl italic underline"} href={"https://www.ed.ac.uk/informatics"}>School of informatics</Link>
          <h1 className={"text-primary mb-2"}>Computer Science Education Group (CSEG)</h1>
          {/*Hero*/}
          <div className={"max-w-[1200px] flex flex-col gap-0 items-stretch justify-stretch bg-white"}>
            {/* Images DIV*/}
            <div className={"flex max-w-2xl"}>
            {/*<div className={"bg-primary min-w-[900px] h-[300px]"}>*/}
            {/*  IMAGE*/}
            {/*</div>*/}
            {/*  Object-voer and h- in Image class forces image to follow a specifcic height*/}
            <Image
                src={getStrapiImageUrl(homepageData.HeroImage.url)}
                alt={homepageData.HeroImage.alternativeText || 'CSEG Organisers'}
                width={900}
                height={300}
                className={"flex justify-center items-center mx-auto object-cover h-[300px]"}
            />
              <div className={"flex flex-col"}>
                <div className={"h-[126px] w-[280px] mx-5 mt-5"}>
                  <Image src="/UOE_logo.webp" alt="University of Edinburgh Logo" width={300} height={126} />
                </div>
                <div className={"h-[126px] w-[280px] mx-5"}>
                  <Image src="/CSEG_Logo_large_supercropped.webp" alt="CSEG Logo" width={280} height={126} />
                </div>
              </div>
            </div>
          <div className={"border-2 border-primary w-4xl"}>
            <StyledMarkdown text={homepageData.HeroText}/>
          </div>

          </div>
          {/*  Quick action cards*/}
          {/*<div className={"my-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  grid gap-4"}>*/}
            {/*<HomepageCard*/}
            {/*  url={homepageData.PublicationsCardImage.url}*/}
            {/*  alternativeText={homepageData.PublicationsCardImage.alternativeText}*/}
            {/*  titleText="Publications"*/}
            {/*  bodyText={homepageData.PublicationsCardText}*/}
            {/*  buttonText="Explore our Publications"*/}
            {/*  buttonHref="/publications"*/}
            {/*/>*/}
            {/*<HomepageCard*/}
            {/*    url={homepageData.ResearchProjectsCardImage.url}*/}
            {/*    alternativeText={homepageData.ResearchProjectsCardImage.alternativeText}*/}
            {/*    titleText="Research projects"*/}
            {/*    bodyText={homepageData.ResearchProjectsCardText}*/}
            {/*    buttonText="Explore our projects"*/}
            {/*    buttonHref="/research"*/}
            {/*/>*/}
            {/*<HomepageCard*/}
            {/*  url={homepageData.AboutUsCardImage.url}*/}
            {/*  alternativeText={homepageData.AboutUsCardImage.alternativeText}*/}
            {/*  titleText="About us"*/}
            {/*  bodyText={homepageData.AboutUsCardText}*/}
            {/*  buttonText="About us"*/}
            {/*  buttonHref="/about"*/}
            {/*/>            <HomepageCard*/}
            {/*  url={homepageData.JoinUsCardImage.url}*/}
            {/*  alternativeText={homepageData.JoinUsCardImage.alternativeText}*/}
            {/*  titleText="Join us"*/}
            {/*  bodyText={homepageData.JoinUsCardText}*/}
            {/*  buttonText="Join us"*/}
            {/*  buttonHref="/join"*/}
            {/*/>            <HomepageCard*/}
            {/*  url={homepageData.ContactUsCardImage.url}*/}
            {/*  alternativeText={homepageData.ContactUsCardImage.alternativeText}*/}
            {/*  titleText="Contact us"*/}
            {/*  bodyText={homepageData.ContactUsCardText}*/}
            {/*  buttonText="Contact us"*/}
            {/*  buttonHref="/contact"*/}
            {/*/>*/}
          {/*</div>*/}
        </div>
      </main>

      </>
  );
}
