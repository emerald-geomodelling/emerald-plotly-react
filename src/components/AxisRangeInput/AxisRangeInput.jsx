import React, { useRef, useState, useCallback } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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

const AxisRangeInput = ({ plotRef, plotConfig, setPlotConfig }) => {
  const {
    showAxisRangeInput,
    axisRangeInputPosition,
    clickedAxis,
    clickedAxisType,
    setShowAxisRangeInput,
  } = useRightClickAxis(plotRef);

  const [desiredRangeMin, desiredRange] = plotConfig.layout[clickedAxis]?.range || ["", ""];

  const setRange = ({min, max}) => {
    plotConfig.layout[clickedAxis].range = [min, max];
    setPlotConfig({...plotConfig});
  }
  const resetRange = () => {
    plotConfig.layout[clickedAxis].range = [];
    setPlotConfig({...plotConfig});
  }

  const boxWidth = 208;
  const boxHeight = 81.5;

  const handleResetAxis = () => {
    setShowAxisRangeInput(false);
    resetRange();
  };

  const rightClickContainerRef = useOutsideClick(() => { setShowAxisRangeInput(false); });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowAxisRangeInput(false);
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
          onChange={(e) => {
            setRange({min: parseFloat(e.target.value),
                      max: desiredRange});
          }}
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
          onChange={(e) => {
            setRange({min: desiredRangeMin,
                      max: parseFloat(e.target.value)});
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleKeyPress(e);
          }}
          className="axisInput"
        />
        <button className="axisButton" onClick={resetRange}>
          <ArrowPathIcon className="iconStyle" />
        </button>
      </form>
    </div>
  );
};

export default AxisRangeInput;
