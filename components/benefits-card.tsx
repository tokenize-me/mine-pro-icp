import React from "react";
import Image from "next/image";

interface Props {
  image: string;
  title: string;
  description: string;
}

const BenefitsCard: React.FC<Props> = ({ image, title, description }) => {
  return (
    <div className="benefitCard">
      <div className="benefitCardGradient1"></div>
      <div className="benefitCardGradient2"></div>

      <div className="absolute -top-10">
        <div className="glassContainerContainerRound">
          <div className="benefitOrangeCircle">
            <div className="flex itec justify-center">
              {title === "Highly profitable Bitcoin mining" ? (
                <Image
                  src={image}
                  alt={`benefit icon`}
                  width={22}
                  height={22}
                />
              ) : (
                <Image
                  src={image}
                  alt={`benefit icon`}
                  width={26}
                  height={26}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="grayTextGradient text-[20px] 2xl:text-[25px]">{title}</h2>
      <p className="mt-3 text-white/60 text-[13px] 2xl:text-[16px]">
        {description}
      </p>
    </div>
  );
};

export default BenefitsCard;
