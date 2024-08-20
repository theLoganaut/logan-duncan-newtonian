import React, { useEffect, useState } from "react";

const CircleCollage = ({ items }) => {
  const [circles, setCircles] = useState([]);
  const [flutterCircle, setFlutterCircle] = useState([]);
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [largestCircleSize, setLargestCircleSize] = useState(0);
  

  useEffect(() => {
    const calculateCircles = () => {
      const maxWeight = Math.max(...items.map((item) => item.weight));
      
      // get screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const targetSize = Math.min(screenWidth, screenHeight) / 2; // size for collage
      let sizeMulti = 1;
      console.log(screenWidth)
      if (screenWidth > 600 && screenWidth < 800) {
        console.log("huh")
        sizeMulti = 1.1
      }

      // get circle properties
      //? multi needed to correct for some circles being hidden
      const circles = items
        .map((item, index) => ({
          ...item,
          size: ((item.weight / maxWeight) * targetSize) / sizeMulti, // circle size relative to max weight and target size
          radius: ((item.weight / maxWeight) * targetSize) / (sizeMulti * 2), // radius for position calculations
          index,
        }))
        .sort((a, b) => b.weight - a.weight); // sort circles by weight in descending order

      // set the largest circle size
      setLargestCircleSize(circles[0].size);

      const positions = [];

      // largest circle center
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      circles[0].position = { x: centerX, y: centerY };
      circles[0].zIndex = circles.length + 1;
      positions.push(circles[0]);

      for (let i = 1; i < circles.length; i++) {
        let placed = false;
        for (let j = 0; j < positions.length && !placed; j++) {
          const existingCircle = positions[j];
          for (let angle = 0; angle < 360; angle += 10) {
            const rad = angle * (Math.PI / 180);
            let x =
              existingCircle.position.x +
              (circles[i].radius + existingCircle.radius) * Math.cos(rad);
            let y =
              existingCircle.position.y +
              (circles[i].radius + existingCircle.radius) * Math.sin(rad);

            // all circles stay within the screen boundaries
            x = Math.max(
              circles[i].radius,
              Math.min(screenWidth - circles[i].radius, x)
            );
            y = Math.max(
              circles[i].radius,
              Math.min(screenHeight - circles[i].radius, y)
            );

            if (
              positions.every(
                (p) =>
                  Math.hypot(p.position.x - x, p.position.y - y) >=
                  circles[i].radius + p.radius
              )
            ) {
              circles[i].position = { x, y };
              circles[i].zIndex = circles.length - i; // decrease z for circles farther from center
              positions.push(circles[i]);
              placed = true;
              break;
            }
          }
        }

        // if unable to place within bounds, retry with a smaller step angle
        // this doesnt seem to kick in but doesnt work if removed
        if (!placed) {
          for (let j = 0; j < positions.length && !placed; j++) {
            const existingCircle = positions[j];
            for (let angle = 0; angle < 360; angle += 5) {
              const rad = angle * (Math.PI / 180);
              let x =
                existingCircle.position.x +
                (circles[i].radius + existingCircle.radius) * Math.cos(rad);
              let y =
                existingCircle.position.y +
                (circles[i].radius + existingCircle.radius) * Math.sin(rad);

              x = Math.max(
                circles[i].radius,
                Math.min(screenWidth - circles[i].radius, x)
              );
              y = Math.max(
                circles[i].radius,
                Math.min(screenHeight - circles[i].radius, y)
              );

                circles[i].position = { x, y };
                circles[i].zIndex = circles.length - i; // decrease z for circles farther from center
                positions.push(circles[i]);
                placed = true;
                break;
            }
          }
        }
      }

      setCircles(circles);
    };

    // get circles on window resize
    const handleResize = () => {
      calculateCircles();
    };

    window.addEventListener("resize", handleResize);
    calculateCircles();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  const handleClick = (circleIndex) => {
    if (hoveredCircle != null) {
      setHoveredCircle(null);
    } else {
      setHoveredCircle(circleIndex);
      setFlutterCircle(null);
    }
  };

  const handleFlutter = (circleIndex) => {
    if (window.innerWidth > 1000) {
      if (flutterCircle != null) {
        setFlutterCircle(null);
      } else {
        setFlutterCircle(circleIndex);
      }
    }
  };

  return (
    <div className="relative base:translate-x-12 sm:translate-x-0 sm:scale-75">
      {circles.map((circle, index) => (
        <div
          key={index}
          className={`absolute rounded-full flex justify-center items-center border-white border-2`}
          style={{
            width: `${
              hoveredCircle === index
                ? largestCircleSize * 1.5
                : flutterCircle === index
                ? circle.size * 1.2
                : circle.size
            }px`,
            height: `${
              hoveredCircle === index
                ? largestCircleSize * 1.5
                : flutterCircle === index
                ? circle.size * 1.2
                : circle.size
            }px`,
            backgroundColor: circle.color,
            left: `${
              hoveredCircle === index
                ? window.innerWidth / 2
                : circle.position.x
            }px`,
            top: `${
              hoveredCircle === index
                ? window.innerHeight / 2
                : circle.position.y
            }px`,
            zIndex:
              hoveredCircle === index
                ? circles.length + 2
                : circles.length - index,
            transform: "translate(-50%, -50%)",
            transition:
              "width 0.5s ease, height 0.5s ease, left 0.5s ease, top 0.5s ease, z-index .3s ease, justifyContent .5s ease, alignItems .5s ease, display .5s ease",
          }}
          onMouseEnter={() => handleFlutter(index)}
          onMouseLeave={() => handleFlutter(null)}
          onMouseUp={() => handleClick(index)}
        >
          <div>
            <div
              onMouseEnter={() => handleFlutter(index)}
              className={`${
                hoveredCircle === index
                  ? "items-center duration-1000 -translate-y-2 md:-translate-y-24 text-center"
                  : "duration-1000"
              } underline cursor-pointer md:text-3xl`}
            >
              {circle.title}
            </div>
            <div
              className={`${
                hoveredCircle === index
                  ? "justify-center items-center my-auto opacity-100 transition-opacity duration-1000 text-center w-3/4 mx-auto"
                  : "opacity-10 hidden absolute"
              }`}
            >
              {circle.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CircleCollage;
