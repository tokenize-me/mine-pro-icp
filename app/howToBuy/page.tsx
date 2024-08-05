"use client";
import MineProTag from "@/components/minepro-tag";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <section
      id="how-to-buy"
      className="max-w-[1600px] relative mx-auto mt-[52px] mb-[72px] px-8 lg:px-16 flex flex-col items-center"
    >
      <div className="howToBuyDivGradient"></div>
      <MineProTag />
      <h2 className="mt-10 grayTextGradient  max-w-xl lg:max-w-[800px] text-[32px] sm:text-[48px] lg:text-[64px] 2xl:text-[80px] text-center">
        How to Buy <span className="orangTextGradient">$MINE </span> Token
      </h2>
      <p className="mt-6 grayTextGradient  max-w-xl lg:max-w-3xl tracking-wide font-thin  text-sm md:text-base  2xl:text-xl  text-center">
        Not sure how everything works? Check out our simple tutorial videos
        below on how to buy $MINE or use the instructions below them!
      </p>
      <div className=" mt-16 md:mt-20 max-w-5xl 2xl:max-w-7xl flex flex-col justify-center items-center gap-8 p-2  w-full">
        {/* step 01 */}
        <div className=" w-full">
          <div className="FAQCard glassCard  w-full p-4 overflow-hidden">
            <div className="FAQCardGradient1"></div>
            <div className="FAQCardGradient2"></div>

            {/* top section - always visible */}
            <div className="w-full flex items-center">
              <div className="FAQOrangeCircle">
                <p className={` text-2xl font-bold tracking-wider`}>01</p>
              </div>
              <h2 className="text-left  pl-6 grayTextGradient  text-[23px] lg:text-[30px]">
                Visit the ICP NNS app:
              </h2>
            </div>
          </div>
          <p className="mt-6 grayTextGradient  w-full tracking-wide   text-sm md:text-base  2xl:text-xl px-5">
          Visit the ICP NNS app here:
            <a
              target="true"
              href="https://nns.ic0.app/"
              className="px-1.5 orangeTextGradient"
            >
              nns.ic0.app,
            </a>
            You'll need ICP loaded in your wallet to participate. We suggest using the Bitfinity wallet. 
            You can purchase ICP on any major exchange, just be sure to send to your wallet on the ICP network.
          </p>
          <div className="w-full mt-12 md:mt-16">
            <Image
              src="/how-to-buy/image6.png"
              alt="Connect Wallet"
              className=" w-full h-full shadow-md rounded-xl image-shadow"
              width={1920}
              height={1080}
            />
          </div>
          <div className="w-full mt-10 md:mt-16">
            <Image
              src="/how-to-buy/image3.png"
              alt="Connect Wallet"
              className=" w-full h-full shadow-md rounded-xl image-shadow"
              width={1920}
              height={1080}
            />
          </div>
        </div>
        {/* step 02 */}
        <div className=" w-full mt-16 2xl:mt-24 relative ">
          <div className="stepsGradient"></div>
          <div className="FAQCard glassCard  w-full p-4 overflow-hidden">
            <div className="FAQCardGradient1"></div>
            <div className="FAQCardGradient2"></div>

            {/* top section - always visible */}
            <div className="w-full flex items-center">
              <div className="FAQOrangeCircle">
                <p className={` text-2xl font-bold tracking-wider`}>02</p>
              </div>
              <h2 className="text-left  pl-6 grayTextGradient  text-[23px] lg:text-[30px]">
                Sign in with Internet Identity or create one
              </h2>
            </div>
          </div>
          <p className="mt-6 grayTextGradient  w-full tracking-wide   text-sm md:text-base  2xl:text-xl px-5">
            Create an Internet Identity or sign in with an existing one.
          </p>
          <div className="w-full mt-12 md:mt-16">
            <Image
              src="/how-to-buy/image1.png"
              alt="Connect Wallet"
              className=" w-full h-full shadow-md rounded-xl image-shadow"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
