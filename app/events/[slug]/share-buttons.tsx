"use client"
import React from 'react'
import {LinkedinShareButton, LinkedinIcon} from "react-share";
type ShareButtonProps ={
  url: string
}
/**
 * This is a client component for window.location.href
 * @constructor
 */
function ShareButtons({url} :ShareButtonProps) {
  console.log(url);
  return (
      <div className={"mt-4"}>
        <p>Share this event</p>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={32}/>
        </LinkedinShareButton>
      </div>
  )
}

export default ShareButtons
