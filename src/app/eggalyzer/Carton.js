"use client";
import React, { useState } from "react";
import Egg from "./Egg.js";
import EggHolder from "./EggHolder.js";

const Carton = ({eggs, changeHover, crackEgg}) => {
  return (
    <div className="relative w-full scale-y-50 md:scale-y-100">
      <div className="relative w-3/4 lg:w-1/2 h-36 bg-yellow-700 p-4 rounded-lg mx-auto">
        {/* Top eggs */}
        <div className="absolute -top-14 left-0 right-0 h-48 flex justify-around items-center space-x-2 px-2">
          <Egg eggnum={eggs.egg0} />
          <Egg eggnum={eggs.egg1} />
          <Egg eggnum={eggs.egg2} />
          <Egg eggnum={eggs.egg3} />
          <Egg eggnum={eggs.egg4} />
          <Egg eggnum={eggs.egg5} />
        </div>
      </div>
      <div className="w-full">
        {/* top egg carton holes, change to bg-yellow-800 when egg gets clicked */}
        <div className="relative w-3/4 lg:w-1/2 h-12 -top-16 bg-yellow-700 rounded-lg mx-auto">
          <div className="absolute -top-32 left-0 right-0 h-48 flex justify-around items-center space-x-2 px-2">
            <EggHolder
              eggnum={eggs.egg0}
              eggString={"egg0"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg1}
              eggString={"egg1"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg2}
              eggString={"egg2"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg3}
              eggString={"egg3"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg4}
              eggString={"egg4"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg5}
              eggString={"egg5"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
          </div>
        </div>
      </div>
      <div className="relative w-3/4 lg:w-1/2 h-36 bg-yellow-700 p-4 rounded-lg -top-16 mx-auto">
        <div className="absolute -top-14 left-0 right-0 h-48 flex justify-around items-center space-x-2 px-2">
          <Egg eggnum={eggs.egg6} />
          <Egg eggnum={eggs.egg7} />
          <Egg eggnum={eggs.egg8} />
          <Egg eggnum={eggs.egg9} />
          <Egg eggnum={eggs.egg10} />
          <Egg eggnum={eggs.egg11} />
        </div>
      </div>
      <div className="relative w-full -top-16">
        <div className="relative w-3/4 lg:w-1/2 h-12 -top-16 bg-yellow-700 p-4 rounded-lg mx-auto">
          <div className="absolute -top-32 left-0 right-0 h-48 flex justify-around items-center space-x-2 px-2">
            <EggHolder
              eggnum={eggs.egg6}
              eggString={"egg6"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg7}
              eggString={"egg7"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg8}
              eggString={"egg8"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg9}
              eggString={"egg9"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg10}
              eggString={"egg10"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
            <EggHolder
              eggnum={eggs.egg11}
              eggString={"egg11"}
              changeHover={changeHover}
              crackEgg={crackEgg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carton;
