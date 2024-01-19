import React, { useEffect, useRef, useState } from "react";

const CustomMenuPopup = ({ content, clickPosition, setShowPopup }) => {
  const popupRef = useRef(null);
  const [leftBuffer, setLeftBuffer] = useState(0);
  const [topBuffer, setTopBuffer] = useState(0);

  console.log("content passed to menu", content);

  useEffect(() => {
    if (popupRef.current) {
      const { width, height } = popupRef?.current.getBoundingClientRect();

      console.log("Popup dimensions:", { width, height });

      const rightEdgeOverflow =
        clickPosition.x + width > clickPosition.clientWidth;
      const newLeft = rightEdgeOverflow ? -width - 5 : -width - 5;
      const bottomEdgeOverflow = clickPosition.y + height > height;
      const newTop = bottomEdgeOverflow ? -bottomEdgeOverflow - 260 : 0;

      console.log("Calculated position:", { newLeft, newTop });
      console.log("Click position:", clickPosition);

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
    maxHeight: `620px`,
    width: `fit-content`,
    zIndex: 1000,
    overflowY: "scroll",
    overflowX: "hidden",
  };

  return (
    <div
      ref={popupRef}
      style={style}
      className="absolute shadow-lg bg-gray-50 h-fit border border-gray-200 rounded-md p-1.5"
    >
      {content}
    </div>
  );
};

export default CustomMenuPopup;
