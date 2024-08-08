import React from "react";

const NewtonCradleTop = () => {
  return (
    <div className="absolute top-28 md:top-48 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex pendulum_box md:pt-28 md:px-16">
        <div className="ball first md:w-24 md:h-24 md:before:h-28 md:before:-top-28 md:before:left-12 md:origin-50-150"><div className="text-center text-white text-4xl mt-1 md:mt-3 md:text-7xl">L</div></div>
        <div className="ball md:w-24 md:h-24 md:before:h-28 md:before:-top-28 md:before:left-12"><div className=" text-center text-white text-4xl mt-1 md:mt-3 md:text-7xl">O</div></div>
        <div className="ball md:w-24 md:h-24 md:before:h-28 md:before:-top-28 md:before:left-12"><div className=" text-center text-white text-4xl mt-1 md:mt-3 md:text-7xl">G</div></div>
        <div className="ball md:w-24 md:h-24 md:before:h-28 md:before:-top-28 md:before:left-12"><div className=" text-center text-white text-4xl mt-1 md:mt-3 md:text-7xl">A</div></div>
        <div className="ball last md:w-24 md:h-24 md:before:h-28 md:before:-top-28 md:before:left-12 md:origin-50-150"><div className=" text-center text-white text-4xl mt-1 md:mt-3 md:text-7xl">N</div></div>
      </div>
    </div>
  );
};

export default NewtonCradleTop;
