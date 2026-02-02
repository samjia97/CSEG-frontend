"use client"
import React from 'react'
import {LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon} from "react-share";
type ShareButtonProps ={
  url: string
  title: string
}
/**
 * This is a client component for window.location.href
 * @constructor
 */
function ShareButtons({url, title} :ShareButtonProps) {
  return (
      <div className={"mt-4"}>
        <p>Share this event</p>
        <div className={"flex gap-4"}>
          <LinkedinShareButton url={url} source={url} title={title}>
            <LinkedinIcon size={32}/>
          </LinkedinShareButton>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32}/>
          </TwitterShareButton>

        </div>
      </div>
  )
}

export default ShareButtons
