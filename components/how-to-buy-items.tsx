import React from "react";
import Image from "next/image";

interface HowToBuyItem {
  step: number;
  title: string;
  description: string;
}

const howToBuyItems: HowToBuyItem[] = [
  {
    step: 1,
    title: "Visit the ICP NNS app",
    description:
      "Visit: https://nns.ic0.app/. You'll need ICP loaded in your wallet to participate. We suggest using the Bitfinity wallet. You can purchase ICP on any major exchange, just be sure to send to your wallet on the ICP network.",
  },
  {
    step: 2,
    title: "Sign in with Internet Identity",
    description:
      "You'll need to have or create an Internet Identity to participate in the SNS Dao Sale. This is a secure way to manage your digital identity on the Internet Computer.",
  },
  {
    step: 3,
    title: "Find Our SNS Dao Sale",
    description:
      "Click on Launchpad and find our launch under 'Current Launches'",
  },
  {
    step: 4,
    title: "Participate",
    description:
      "Click on Participate and choose how much ICP to contribute.",
  },
];

export const HowToBuyItems = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-6">
      {howToBuyItems.map((item, index) => (
        <div
          key={index}
          className={`howToBuyItemCard text-center w-full relative `}
        >
          {/* gradient */}
          <div className="howToBuyItemGradient"></div>

          {/* item number circle */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="glassContainerContainerRoundHowToBuy">
              <div className="howToBuyOrangeCircle">
                <p className="text-white text-[16px]">{item.step}</p>
              </div>
            </div>
          </div>

          {/* content */}
          <p className="mt-12 grayTextGradient text-[24px]">{item.title}</p>
          <p className="mt-3 text-white/60 text-[14px] leading-[150%]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
