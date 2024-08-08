import React from "react";

const EggHolder = ({ eggnum, eggString, changeHover, crackEgg }) => {
  return (
    <button
      className={`w-36 lg:h-32 h-24 transition-opacity duration-500 ${
        eggnum.hover & (eggnum.used === false) ? "opacity-40" : ""
      } ${eggnum.used ? "bg-yellow-800" : "bg-[#FCD6A4]"}`}
      style={{ borderRadius: "50%" }}
      disabled={eggnum.used}
      onMouseEnter={() => changeHover(eggString, true)}
      onMouseLeave={() => changeHover(eggString, false)}
      onMouseUp={() => crackEgg(eggString, true)}
    >
      <div className="scale-y-150 text-4xl z-30 font-custom"></div>
    </button>
  );
};

export default EggHolder;
