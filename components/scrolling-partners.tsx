"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: "dappd", logo: "/partners/dappd.png" },
  { name: "Bitmain", logo: "/partners/bitmain.svg" },
  { name: "Logic Mining", logo: "/partners/logic-mining.png" },
  { name: "Circle", logo: "/partners/circle.svg" },
  { name: "Webinopoly", logo: "/partners/webinopoly.png" },
  { name: "Full Base", logo: "/partners/full-base.svg" },
];

const ScrollingPartners: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    const scroll = async () => {
      while (true) {
        await controls.start({
          x: [0, -1000],
          transition: {
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      }
    };
    scroll();
  }, [controls]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="whitespace-nowrap h-[104px] flex flex-row gap-24"
        animate={controls}
        style={{ x: 0 }}
      >
        {partners.map((partner, index) => (
          <div key={index} className="partnerItemCard flex-shrink-0">
            {/* gradient */}
            <div className="partnerItemGradient"></div>

            {/* content - logo */}
            <div className="">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={200}
              />
            </div>
            {/* <p className="grayTextGradient">{partner.name}</p> */}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingPartners;
