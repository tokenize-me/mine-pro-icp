import React from "react";

const MineProTag: React.FC = () => {
  return (
    <div className="mineproTag w-40">
      <div className="w-5 h-5">
        <img src="/logo-white.svg" alt="minepro tag" width={20} height={20} />
      </div>
      <p className="text-[14px]">MinePro</p>
    </div>
  );
};

export default MineProTag;
