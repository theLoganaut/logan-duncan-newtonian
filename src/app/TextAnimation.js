import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

const TextAnimation = ({ text }) => {
  // const [isVisible, setIsVisible] = useState(false);
  const hiddenRef = useRef(null);
  const containerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.5, // trigger when 50% of component is in view
    triggerOnce: true, // only trigger once
  });
  const [binaryText, setBinaryText] = useState("");
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let binaryInterval;
    let binary = "";
    if (inView) {
      // generate binary representation
      setOpen(true)
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
    if (hiddenRef.current && containerRef.current) {
      containerRef.current.style.height = `${hiddenRef.current.clientHeight}px`;
    }
  }, [text]);

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
    <div ref={ref} className={`justify-center items-center p-2 border-t-2 lg:border-b-2 border-gray-500`}
    style={{
      transform: inView ? "scaleY(1)" : "scaleY(0)",
      transition: "transform 1000ms !important", // Applying transition with !important
    }}

    >
      <div ref={containerRef} className="relative overflow-hidden">
      <div className="absolute text-sm md:text-lg invisible" ref={hiddenRef}>
        {text}
      </div>
      <div className="inset-0 text-sm md:text-lg whitespace-pre-line">
        {text.substring(0, displayedIndex)}
        {binaryText.substring(displayedIndex)}
      </div>
      </div>
      
    </div>
  );
};

export default TextAnimation;
