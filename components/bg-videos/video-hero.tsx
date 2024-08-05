"use client";
import React from "react";
import ReactPlayer from "react-player";

const VideoHero = () => {
  //video path
  let videosrc = "/animation/circle-1mb.webm";

  return (
    <div>
      <ReactPlayer
        className="w-[350px] lg:w-[1000px] h-full"
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

export default VideoHero;