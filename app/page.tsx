
import {Button} from "@/components/ui/button";
import {Navbar03} from "@/components/ui/shadcn-io/navbar-03";
import Image from "next/image";
import Link from "next/link"
import {getHomepage} from "@/app/get-homepage";
import {getStrapiImageUrl} from "@/lib/api";
export default async function Home() {
  const homepageData = await getHomepage();
  if (homepageData === undefined){
    return (<div>
      <p>Sorry, we are experiencing technical issues. Please come back later</p>
    </div>)
  }
  console.debug(homepageData);
  return (
      <main className="w-full pt-4">
        <div className={"w-full flex flex-col items-center"}>
          <Link className={"text-2xl italic underline"} href={"https://www.ed.ac.uk/informatics"}>School of informatics</Link>
          <h1 className={"text-3xl text-primary"}>Computer Science Education Group (CSEG)</h1>
          <div>
            <Image
                src={getStrapiImageUrl(homepageData.HeroImage.url)}
                alt={homepageData.HeroImage.alternativeText}
                width={900}
                height={400}
            />
          </div>
        </div>
      </main>
  );
}
