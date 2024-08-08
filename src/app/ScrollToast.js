import React from 'react';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import 'tailwindcss/tailwind.css';

const ScrollToast = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="z-20 overflow-y-auto fixed bottom-4 right-4 p-4 items-center space-y-2">
      <div className="flex flex-col space-y-2">
        <button
          onClick={scrollToTop}
          className="bg-blue-500 text-white p-2 border-gray-400 rounded-full hover:bg-blue-600 transition duration-300"
        >
          <BsArrowUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default ScrollToast;
