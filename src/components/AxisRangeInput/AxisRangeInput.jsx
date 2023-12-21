import React, { useRef, useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const AxisRangeInput = ({
  subplotZooms,
  setSubplotZooms,
  axis = "x",
  handleZoomFn,
  axisName,
  resetAxisRange,
  setShowAxisRangeInput,
  clickPosition,
}) => {
  const [desiredRange, setDesiredRange] = useState("");
  const [desiredRangeMin, setDesiredRangeMin] = useState("");

  const boxWidth = 208;
  const boxHeight = 81.5;

  const righClickContainerRef = useRef(null);

  const handleZoomChange = () => {
    setShowAxisRangeInput(false);
    if (handleZoomFn) {
      handleZoomFn({
        setSubplotZooms,
        subplotZooms,
        desiredRange,
        desiredRangeMin,
        axisName,
      });
    }
  };

  const handleResetAxis = () => {
    setShowAxisRangeInput(false);
    if (resetAxisRange) {
      resetAxisRange({
        setSubplotZooms,
        subplotZooms,
        axisName,
      });
    }
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        righClickContainerRef.current &&
        !righClickContainerRef.current.contains(event.target)
      ) {
        setShowAxisRangeInput(false);
        if (handleZoomFn) {
          handleZoomFn({
            setSubplotZooms,
            subplotZooms,
            desiredRange,
            desiredRangeMin,
            axisName,
          });
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [
    subplotZooms,
    desiredRange,
    desiredRangeMin,
    axisName,
    handleZoomFn,
    setSubplotZooms,
    setShowAxisRangeInput,
  ]);

  return (
    <div
      ref={righClickContainerRef}
      className="axisRangeInput absolute drop-shadow-xl bg-white rounded-lg border border-gray-100 flex flex-col gap-2 p-2 px-2"
      style={{
        width: boxWidth,
        height: boxHeight,
        top: `${clickPosition.y}px`,
        left: `${clickPosition.x}px`,
        zIndex: 1000,
      }}
    >
      <label className="text-gray-600 text-sm text-center">Axis range</label>
      <form className="flex gap-1" onSubmit={(e) => e.preventDefault()}>
        <input
          name={`${axis}-min`}
          type="number"
          placeholder={`${axis}-min`}
          value={desiredRangeMin}
          onChange={(e) => setDesiredRangeMin(parseFloat(e.target.value))}
          className={`
          block w-full rounded-md placeholder:text-gray-500 
          focus:ring-0 focus:ring-inset sm:leading-6 focus:outline-none 
          focus:border-purple-500 text-sm bg-transparent py-1.5 px-2 
          border border-1 border-slate-300 rounded-md hover:border-purple-500
        `}
        />
        <input
          name={`${axis}-max`}
          type="number"
          placeholder={`${axis}-max`}
          value={desiredRange}
          onChange={(e) => setDesiredRange(parseFloat(e.target.value))}
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

export default AxisRangeInput;
