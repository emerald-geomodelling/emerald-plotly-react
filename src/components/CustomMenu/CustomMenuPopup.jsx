import React, { useEffect, useRef } from "react";

const CustomMenuPopup = ({ content, setShowPopup }) => {
  const popupRef = useRef(null);

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

  const style = {
    left: -40,
    top: 0,
    zIndex: 100,
  };

  return (
    <div
      ref={popupRef}
      style={style}
      className="absolute shadow-lg bg-blue-200 h-10 w-10 border-gray-200 rounded-md"
    >
      {content}
    </div>
  );
};

export default CustomMenuPopup;
