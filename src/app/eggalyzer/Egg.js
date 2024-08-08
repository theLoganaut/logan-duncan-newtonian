"use client"
import React from "react";

const Egg = ({ eggnum }) => {
  return (
    <div
      className={`w-36 h-32 lg:h-44 bg-[#FCD6A4] border-2 transition-transform duration-1000 border-black ${
        eggnum.hover ? "lg:-translate-y-20 -translate-y-10" : ""
      } ${eggnum.used ? "transition-all opacity-0 duration-1000 -translate-y-20 z-10 scale-0" : ""}`}
      style={{ borderRadius: "50%" }}
    ></div>
  );
};

export default Egg;
