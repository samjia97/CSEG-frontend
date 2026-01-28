import {getAboutPage} from "@/app/about/api/get-about-page";
import React from "react";
import Markdown from "react-markdown";

export default async function AboutUs() {
  const aboutUsData = await getAboutPage();
  return (
      <>
        <div className={"flex flex-col text-center mb-4 bg-red-800/80 text-white rounded-lg "}>
          <h2 className={""}>About us</h2>
        </div>
        <div className={"prose max-w-none bg-neutral-50 p-4 prose-headings:font-normal prose-li:marker:text-black"}>
          <Markdown
          >{aboutUsData.content}</Markdown>
        </div>
      </>
  )
}