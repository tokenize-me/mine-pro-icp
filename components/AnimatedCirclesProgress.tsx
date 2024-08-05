import React, { useState, useEffect } from "react";

const CircleAnimation = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => {
  const totalCircles = 17;
  const horizontalRadius = 270; // Horizontal radius of the semi-oval
  const verticalRadius = 220; // Vertical radius of the semi-oval

  console.log("progressPercentage", progressPercentage);
  const [litCircles, setLitCircles] = useState(progressPercentage || 0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setResetting(true); // Trigger resetting state
    setTimeout(() => {
      const circlesToLight = Math.round(
        (progressPercentage / 100) * totalCircles
      );
      setLitCircles(circlesToLight);
      setResetting(false); // Clear resetting state
    }, 200); // Duration for reset effect, adjust as needed
  }, [progressPercentage]);
  const handleButtonClick = (percentage: number) => {};

  const calculatePosition = (index: number) => {
    const angle = (Math.PI / (totalCircles - 1)) * index; // Angle in radians
    const x = horizontalRadius * Math.cos(angle);
    const y = verticalRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="circle-animation">
      <div className="semicircle-container">
        {[...Array(totalCircles)].map((_, index) => {
          const { x, y } = calculatePosition(index);
          return (
            <div
              key={index}
              className={`circle ${index < litCircles ? "lit" : ""} ${
                resetting ? "resetting" : ""
              }`}
              style={{
                right: `calc(50% + ${x}px)`,
                top: `calc(50% - ${y}px + 15px) `,
                transitionDelay: `${index * 0.05}s`,
              }}
            />
          );
        })}
      </div>
      {/* <div className="buttons">
        <button onClick={() => handleButtonClick(5)}>5%</button>
        <button onClick={() => handleButtonClick(90)}>90%</button>
      </div> */}
    </div>
  );
};

export default CircleAnimation;
