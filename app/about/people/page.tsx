import {getPeopleData} from "@/app/about/people/api/get-people";
import React from "react";
import Image from "next/image";
import {getStrapiImageUrl} from "@/lib/api";
import Link from "next/link";

export default async function PeoplePage() {
  const peopleData = await getPeopleData();
  return (
      <>
        <div className={"flex flex-col text-center mb-4 bg-red-800/80 text-white rounded-lg p-1 "}>
          <h2 className={""}>Our people</h2>
        </div>
        <div className={"flex flex-col"}>
          {peopleData.map((value) =>
              <div key={value.documentId} className={"flex gap-4 p-2 border-b-4"}>
                <Image src={getStrapiImageUrl(value.picture.url)} alt={value.picture.url || 'Image of organiser'} width={128} height={128}/>
                <div className={"flex flex-col"}>
                  {value.link ? <Link className={"text-lg text-primary"} href={value.link}>{value.name}</Link> : <p className={"text-lg"}>{value.name}</p>}
                  <p>{value.description}</p>
                </div>

              </div>)}
        </div>
      </>
  )
}