"use client";
import React from "react";
import ReactPlayer from "react-player";

const VideoGaris = () => {
  //video path
  //let videosrc = "/animation/coin-1mb.webm";
  let videosrc = "/animation/GARIS_WEBM.webm";

  return (
    <div>
      <ReactPlayer
        width="200px"
        height="560px"
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

export default VideoGaris;
