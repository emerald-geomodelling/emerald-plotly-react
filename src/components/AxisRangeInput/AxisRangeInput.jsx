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

const AxisRangeInput = ({ plotRef, subplotZooms, setSubplotZooms }) => {
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

  const handleZoomChange = () => {
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
      className="axisRangeInput"
      style={{
        width: boxWidth,
        height: boxHeight,
        top: `${axisRangeInputPosition.y}px`,
        left: `${axisRangeInputPosition.x}px`,
        zIndex: 1000,
      }}
    >
      <label className="axisLabel">Axis range</label>
      <form className="axisForm" onSubmit={(e) => e.preventDefault()}>
        <input
          name={`${clickedAxisType}-min`}
          type="number"
          placeholder={`${clickedAxisType}-min`}
          value={desiredRangeMin}
          onChange={(e) => setDesiredRangeMin(parseFloat(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleKeyPress(e);
          }}
          className="axisInput"
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
          className="axisInput"
        />
        <button className="hidden" onClick={handleZoomChange}></button>
        <button className="axisButton" onClick={handleResetAxis}>
          <ArrowPathIcon className="iconStyle" />
        </button>
      </form>
    </div>
  );
};

export default AxisRangeInput;
