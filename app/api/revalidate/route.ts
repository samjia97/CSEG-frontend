/**
 * API Route to trigger revalidation of specific pages in response
 * to a Strapi webhook
 */

import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest){
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET){
    console.log(secret, 'Failed revalidation secret')
    return NextResponse.json({message:"Invalid token"}, {status: 401});
  }
  try {
    const webhook = await request.json();
    const {event, model, entry} = webhook;
    console.log(`Webhook: ${event} on ${model}`, entry?.id);
    // TODO: Customize revalidation based on event/model if needed
    // Revalidate everything
    const pathsToRevalidate = ['/','/about','/publications','/events','/publications','/research'];
    for (const path of pathsToRevalidate){
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
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