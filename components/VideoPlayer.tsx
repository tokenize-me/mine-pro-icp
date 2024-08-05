"use client";
import React, { useEffect, useRef } from "react";

const VideoPlayer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the iframe is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = iframeRef.current;
          if (iframe) {
            iframe.contentWindow?.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
          }
        } else {
          const iframe = iframeRef.current;
          if (iframe) {
            iframe.contentWindow?.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
          }
        }
      });
    }, options);

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-8 sm:mt-16 lg:mt-32 mb-8 sm:mb-24 lg:mb-[254px] videoFrame w-full h-[300px] sm:h-[400px] lg:h-[600px]"
    >
      <iframe
        ref={iframeRef}
        className="mx-auto"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/588e3OQ5CNc?enablejsapi=1&autoplay=0&loop=1&mute=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
