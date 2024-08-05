"use client";

import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
}

const FAQCard: React.FC<Props> = ({ title, description }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div className="FAQCard glassCard max-w-[1076px] p-4 overflow-hidden">
      <div className="FAQCardGradient1"></div>
      <div className="FAQCardGradient2"></div>

      {/* top section - always visible */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="w-full flex justify-between items-center"
      >
        <h2 className="text-left  pl-4 grayTextGradient  text-[20px] lg:text-[24px]">
          {title}
        </h2>

        <div className="FAQOrangeCircle">
          <div
            className={`w-8 h-8 transition-transform ${
              isExpanded && "rotate-180"
            }`}
          >
            <Image
              src="/icons/chevron.svg"
              alt={`benefit icon`}
              width={32}
              height={32}
            />
          </div>
        </div>
      </button>

      <div
        className="mt-2 ml-4"
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
          maxHeight: isExpanded ? "400px" : 0,
        }}
      >
        <div className="min-h-20">
          <p className="pb-6 text-white/60 text-[18px] w-[95%]">
            {description}
          </p>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default FAQCard;
