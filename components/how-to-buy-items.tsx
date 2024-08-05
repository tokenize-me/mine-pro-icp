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
    title: "Connect With Your Wallet & Select Network",
    description:
      "Connect your decentralized wallet (MetaMask, Trust Wallet, or others) to the MinePro website at the top right of the page. Then, select your wallet in the on-site presale widget, MinePro's presale accepts ERC20, BEP20, BASE, ARBITRUM, and SOL.",
  },
  {
    step: 2,
    title: "Add Crypto to Your Wallet",
    description:
      "Make sure your have ETH, BNB, USDT, or USDC in your wallet ready to swap for $MINE, if you don't, you can purchase some on a third-party exchange or use the card option!",
  },
  {
    step: 3,
    title: "Buy $MINE",
    description:
      "Enter the amount of ETH, BNB, USDT, or USDC to swap for $MINE, then confirm the transaction through your wallet.",
  },
  {
    step: 4,
    title: "Claim Your $MINE and Earn!",
    description:
      "Once our presale ends, you can then claim your $MINE tokens in the same wallet and network you used to purchase. $MINE will be immediately tradable on multiple large exchanges as well as stake-able for huge monthly Bitcoin profits from our facility.",
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
