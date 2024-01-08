import React, { useEffect, useRef, useState } from "react";

const CustomMenuPopup = ({ content, clickPosition, setShowPopup }) => {
  const popupRef = useRef(null);
  const [leftBuffer, setLeftBuffer] = useState(0);
  const [topBuffer, setTopBuffer] = useState(0);

  useEffect(() => {
    if (popupRef.current) {
      const { width, height } = popupRef?.current.getBoundingClientRect();

      const rightEdgeOverflow =
        clickPosition.x + width > clickPosition.clientWidth;
      const newLeft = rightEdgeOverflow ? -width - 5 : -width - 5;
      const bottomEdgeOverflow =
        clickPosition.y + height > clickPosition.clientHeight;
      const newTop = bottomEdgeOverflow ? -bottomEdgeOverflow - 50 : 0;

      setLeftBuffer(newLeft);
      setTopBuffer(newTop);
      popupRef.current.style.transform = "scale(1)";
      popupRef.current.style.opacity = "1";
    }
  }, [content, clickPosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef, setShowPopup]);

  const transitionDuration = "0.2s";
  const style = {
    top: `${topBuffer}px`,
    left: `${leftBuffer}px`,
    transform: "scale(0.98)",
    opacity: 0,
    transition: `transform ${transitionDuration}, opacity ${transitionDuration} ease-in-out`,
    maxWidth: `600px`,
    maxHeight: `400px`,
    width: `350px`,
    zIndex: 2000,
  };

  return (
    <div
      ref={popupRef}
      style={style}
      className="absolute shadow-lg bg-gray-50 h-fit border border-gray-200 rounded-md p-1.5 overflow-y-scroll overflow-x-hidden"
    >
      {content}
    </div>
  );
};

export default CustomMenuPopup;
