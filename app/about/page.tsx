import {getAboutPage} from "@/app/about/api/get-about-page";
import React from "react";
import {StyledMarkdown} from "@/components/custom/StyledMarkdown";

export default async function AboutUs() {
  const aboutUsData = await getAboutPage();
  return (
      <>
        <div className={"flex flex-col text-center mb-4 bg-red-800/80 text-white rounded-lg p-1 py-2"}>
          <h2 className={""}>Our Aims</h2>
        </div>
        <StyledMarkdown text={aboutUsData.content}/>

      </>
  )
}