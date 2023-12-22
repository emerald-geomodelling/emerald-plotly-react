import React, { useRef, useState, useCallback } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { resetAxis, setAxisZoomRange } from "../../handlers";
import { useRightClickAxis } from "../../hooks";

const useOutsideClick = (onOutsideClick) => {
  const ref = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    },
    [onOutsideClick]
  );

  useCallback(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return ref;
};

export const AxisRangeInput = ({ plotRef, subplotZooms, setSubplotZooms }) => {
  const {
    showAxisRangeInput,
    axisRangeInputPosition,
    clickedAxis,
    clickedAxisType,
    setShowAxisRangeInput,
  } = useRightClickAxis(plotRef);

  const [desiredRange, setDesiredRange] = useState("");
  const [desiredRangeMin, setDesiredRangeMin] = useState("");

  const boxWidth = 208;
  const boxHeight = 81.5;

  console.log(subplotZooms);
  const handleZoomChange = () => {
    console.log(clickedAxis, desiredRange, desiredRangeMin, subplotZooms);
    setShowAxisRangeInput(false);
    if (setAxisZoomRange) {
      setAxisZoomRange({
        setSubplotZooms,
        subplotZooms,
        desiredRange,
        desiredRangeMin,
        axisName: clickedAxis,
      });
    }
  };

  const handleResetAxis = () => {
    setShowAxisRangeInput(false);
    if (resetAxis) {
      resetAxis({
        setSubplotZooms,
        subplotZooms,
        axisName: clickedAxis,
      });
    }
  };

  const rightClickContainerRef = useOutsideClick(handleZoomChange);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleZoomChange();
    }
  };

  if (!showAxisRangeInput) {
    return null;
  }
  return (
    <div
      ref={rightClickContainerRef}
      className="axisRangeInput absolute drop-shadow-xl bg-white rounded-lg border border-gray-100 flex flex-col gap-2 p-2 px-2"
      style={{
        width: boxWidth,
        height: boxHeight,
        top: `${axisRangeInputPosition.y}px`,
        left: `${axisRangeInputPosition.x}px`,
        zIndex: 1000,
      }}
    >
      <label className="text-gray-600 text-sm text-center">Axis range</label>
      <form className="flex gap-1" onSubmit={(e) => e.preventDefault()}>
        <input
          name={`${clickedAxisType}-min`}
          type="number"
          placeholder={`${clickedAxisType}-min`}
          value={desiredRangeMin}
          onChange={(e) => setDesiredRangeMin(parseFloat(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleKeyPress(e);
          }}
          className={`
          block w-full rounded-md placeholder:text-gray-500 
          focus:ring-0 focus:ring-inset sm:leading-6 focus:outline-none 
          focus:border-purple-500 text-sm bg-transparent py-1.5 px-2 
          border border-1 border-slate-300 rounded-md hover:border-purple-500
        `}
        />
        <input
          name={`${clickedAxisType}-max`}
          type="number"
          placeholder={`${clickedAxisType}-max`}
          value={desiredRange}
          onChange={(e) => setDesiredRange(parseFloat(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleKeyPress(e);
          }}
          className={`
          block w-full rounded-md placeholder:text-gray-500 
          focus:ring-0 focus:ring-inset sm:leading-6 focus:outline-none 
          focus:border-purple-500 text-sm bg-transparent py-1.5 px-2 
          border border-1 border-slate-300 rounded-md hover:border-purple-500
        `}
        />
        <button className="hidden" onClick={handleZoomChange}></button>
        <button className="mx-1" onClick={handleResetAxis}>
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
