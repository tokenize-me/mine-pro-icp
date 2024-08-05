"use client";

import React from "react";
import { Button } from "./ui/button";

interface Props {
  fullHeight?: boolean;
}

export const ScrollToTop = ({ fullHeight }: Props) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`orangeButton ${fullHeight && "h-full"}`}
    >
      Join Live Presale
    </Button>
  );
};
