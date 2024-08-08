"use client";
import Image from "next/image";
import React from "react";
interface Partner {
  name: string;
  logo: string;
}
interface pngPartner {
  name: string;
  logo: string;
}
const partners: Partner[] = [
  // { name: "dappd", logo: "/partners/dappd.png" },
  // { name: "Bitmain", logo: "/partners/bitmain.svg" },
  { name: "Logic Mining", logo: "/partners/logic-mining.png" },
  // { name: "Circle", logo: "/partners/circle.svg" },
  // { name: "Webinopoly", logo: "/partners/webinopoly.png" },
  // { name: "Full Base", logo: "/partners/full-base.svg" },
  // { name: "web", logo: "/partners/new/webinopoly.webp" },
];

const pngPartners: pngPartner[] = [
  // {
  //   name: "arb",
  //   logo: "/partners/arb.png",
  // },
  // {
  //   name: "sol",
  //   logo: "/partners/sol.png",
  // },
  // {
  //   name: "bybit",
  //   logo: "/partners/bybit.png",
  // },
  // {
  //   name: "cioncap",
  //   logo: "/partners/cioncap.png",
  // },
  // {
  //   name: "eth",
  //   logo: "/partners/eth.png",
  // },
  // {
  //   name: "google",
  //   logo: "/partners/google.png",
  // },
  // {
  //   name: "nvidia",
  //   logo: "/partners/nvidia.png",
  // },
  // {
  //   name: "telegram",
  //   logo: "/partners/telegram.png",
  // },
  // {
  //   name: "tether",
  //   logo: "/partners/tether.png",
  // },
  // {
  //   name: "trust",
  //   logo: "/partners/trust.png",
  // },
  // {
  //   name: "visa",
  //   logo: "/partners/visa.png",
  // },
  // {
  //   name: "mertamask",
  //   logo: "/partners/new/metamask.png",
  // },
  {
    name: "Bitfinity",
    logo: "/partners/bitfinityPartnerReal.jpeg",
  },
  {
    name: "ICP",
    logo: "/partners/icpPartner.png",
  },
];

const Partners = () => {
  return (
    <div className="grid  max-w-[1240px] gap-3  grid-cols-3 md:grid-cols-3 xl:grid-cols-3 px-6 2xl:px-2   mx-auto ">
      {partners.map((partner, index) => (
        <div
          key={index}
          className="  flex justify-center items-center h-[120px]"
        >
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-fill h-fill object-cover"
          />
        </div>
      ))}

      {pngPartners.map((partner, index) => (
        <div
          key={index}
          className="  flex justify-center items-center h-[120px]"
        >
          
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-fill h-fill object-cover brightness-0 invert"
          />
        </div>
      ))}
    </div>
  );
};

export default Partners;

// import styled from '@emotion/styled';

// import styled from "@emotion/styled";
// import {
//   animate,
//   AnimationOptions,
//   motion,
//   useMotionTemplate,
//   useMotionValue,
//   useTransform,
//   useVelocity,
// } from "framer-motion";
// import { useEffect, useState } from "react";
// import Cell, { CELL_SIZE } from "./cell";

// const Container = styled(motion.div)<{
//   columns: number;
// }>`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   overflow: hidden;
//   display: grid;
//   grid-template-columns: repeat(${(props) => props.columns}, 1fr);
//   mask-repeat: no-repeat;
//   mask-image: radial-gradient(
//     180px 180px,
//     rgba(0, 0, 0, 1),
//     rgba(0, 0, 0, 0.4),
//     transparent
//   );
// `;

// function Grid() {
//   const [columns, setColumns] = useState(0);
//   const [rows, setRows] = useState(0);

//   // mouse position
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   // mouse position from center
//   const centerMouseX = useTransform<number, number>(mouseX, (newX) => {
//     return newX - window.innerWidth / 2;
//   });
//   const centerMouseY = useTransform<number, number>(mouseY, (newY) => {
//     return newY - window.innerHeight / 2;
//   });
//   // eased mouse position
//   const mouseXEased = useMotionValue(0);
//   const mouseYEased = useMotionValue(0);
//   // mouse velocity
//   const mouseXVelocity = useVelocity(mouseXEased);
//   const mouseYVelocity = useVelocity(mouseYEased);
//   const mouseVelocity = useTransform<number, number>(
//     [mouseXVelocity, mouseYVelocity],
//     ([latestX, latestY]) => Math.abs(latestX) + Math.abs(latestY)
//   );

//   // determine rows and columns
//   useEffect(() => {
//     // possibly use a resize observer here instead
//     if (typeof window === "undefined") return;
//     const calculateGrid = () => {
//       const columnCount = Math.ceil(window.innerWidth / CELL_SIZE);
//       setColumns(columnCount);
//       const rowCount = Math.ceil(window.innerHeight / CELL_SIZE);
//       setRows(rowCount);
//     };
//     // calculate the grid on load
//     calculateGrid();
//     // recalculate grid on resize
//     window.addEventListener("resize", calculateGrid);
//     // cleanup
//     return () => {
//       window.removeEventListener("resize", calculateGrid);
//     };
//   }, []);

//   // handle mouse move on document
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       // animate mouse x and y
//       animate(mouseX, e.clientX);
//       animate(mouseY, e.clientY);
//       // animate eased mouse x and y
//       const transition: AnimationOptions<number> = {
//         ease: "easeOut",
//         duration: 1,
//       };
//       animate(mouseXEased, e.clientX, transition);
//       animate(mouseYEased, e.clientY, transition);
//     };
//     if (typeof window === "undefined") return;
//     // recalculate grid on resize
//     window.addEventListener("mousemove", handleMouseMove);
//     // cleanup
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   const opacity = useTransform(mouseVelocity, [0, 1000], [0, 1]);
//   const WebkitMaskPosition = useMotionTemplate`${centerMouseX}px ${centerMouseY}px`;

//   return (
//     <Container
//       columns={columns}
//       style={{
//         WebkitMaskPosition,
//       }}
//     >
//       <p className=" text-white text-xl z5 bg-red-700 ">helo</p>
//       {Array.from({ length: columns * rows }).map((_, i) => (
//         <Cell key={i} mouseX={mouseX} mouseY={mouseY} />
//       ))}
//     </Container>
//   );
// }

// export default Grid;
