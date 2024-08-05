"use client";
import React from "react";
import ReactPlayer from "react-player";

const VideoLogo = () => {
  //video path
  let videosrc = "/animation/logo-1mb.webm";

  return (
    <div>
      <ReactPlayer
        width="500px"
        height="auto"
        url={videosrc}
        controls={false}
        loop={true}
        muted={true}
        playing={true}
        // light is usefull incase of dark mode
        light={false}
        // picture in picture
        pip={true}
      />
      <source src={videosrc} type="video/webm" />
    </div>
  );
};

export default VideoLogo;