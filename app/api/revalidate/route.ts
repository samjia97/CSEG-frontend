/**
 * API Route to trigger revalidation of specific pages in response
 * to a Strapi webhook
 */

import {revalidatePath, revalidateTag} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest){
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET){
    return NextResponse.json({message:"Invalid token"}, {status: 401});
  }
  try {
    const webhook = await request.json();
    const {event, model} = webhook;
    // TODO: Customize revalidation based on event/model if needed
    // Revalidate everything
    const pathsToRevalidate = ['/','/about','/events','/publications','/research'];
    for (const path of pathsToRevalidate){
      revalidatePath(path, "layout");
    }
    const tagsToRevalidate = ['strapi']
    for (const tag of tagsToRevalidate){
      revalidateTag(tag, "max");
    }
    return NextResponse.json({
      success: true,
      revalidated: pathsToRevalidate,
      event,
      model
    });
  } catch (e) {
    console.error('Error during revalidation:', e);
    return NextResponse.json({message: "Error during revalidation"}, {status: 500});
  }
}