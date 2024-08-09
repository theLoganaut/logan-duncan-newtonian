import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const TextAnimation = ({ text }) => {
  // const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5, // trigger when 50% of component is in view
    triggerOnce: true, // only trigger once
  });
  const [binaryText, setBinaryText] = useState("");
  const [displayedIndex, setDisplayedIndex] = useState(0);

  useEffect(() => {
    let binaryInterval;
      let binary = "";
    if (inView) {
      

      // generate binary representation
      const generateBinary = () => {
        if (binary.length < text.length) {
          binary +=
            text[binary.length] === " " ? " " : Math.random() < 0.5 ? "0" : "1";
          setBinaryText(binary);
        } else {
          clearInterval(binaryInterval);
        }
      };

      // start generating 
      binaryInterval = setInterval(generateBinary, 40); // speed

      return () => clearInterval(binaryInterval);
    }
  }, [text, inView]);

  useEffect(() => {
    let displayInterval;
    if (inView) {
      // update displayed text one character at a time
      const updateDisplayedText = () => {
        if (displayedIndex <= text.length) {
          setDisplayedIndex(displayedIndex + 1);
        } else {
          clearInterval(displayInterval);
        }
      };

      // start updating 
      displayInterval = setInterval(updateDisplayedText, 50); // speed

      return () => clearInterval(displayInterval);
    }
  }, [text, displayedIndex, inView]);

  return (
    <div ref={ref} className="flex justify-center items-center p-4">
      <div className="text-sm md:text-lg">
        {text.substring(0, displayedIndex)}
        {binaryText.substring(displayedIndex)}
      </div>
    </div>
  );
};

export default TextAnimation;
