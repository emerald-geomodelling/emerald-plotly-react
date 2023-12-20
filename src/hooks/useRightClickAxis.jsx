import { useEffect, useState } from "react";
import { getXAxisNumber, getYAxisNumber } from "../utils";

export const useRightClickAxis = (plotRef) => {
  const [showAxisRangeInput, setShowAxisRangeInput] = useState(false);
  const [axisRangeInputPosition, setAxisRangeInputPosition] = useState({
    x: 0,
    y: 0,
  });
  const [clickedAxis, setClickedAxis] = useState(null);
  const [clickedAxisType, setClickedAxisType] = useState(null);

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();

      let axisType;
      let targetElement = event.target;

      while (targetElement) {
        if (targetElement.classList.contains("ewdrag")) {
          axisType = "x";
          break;
        } else if (targetElement.classList.contains("nsdrag")) {
          axisType = "y";
          break;
        }
        targetElement = targetElement.parentElement;
      }

      setClickedAxisType(axisType);

      const subplot = event.target.dataset.subplot;
      const axisName =
        axisType === "x"
          ? `xaxis${getXAxisNumber(subplot)}`
          : `yaxis${getYAxisNumber(subplot)}`;

      const plotRect = plotRef.current.getBoundingClientRect();
      let x = event.clientX - plotRect.left;
      let y = event.clientY - plotRect.top;

      setShowAxisRangeInput(true);
      setAxisRangeInputPosition({ x, y });
      setClickedAxis(axisName);
    };

    const yAxisLayers = plotRef.current.querySelectorAll(
      ".main-svg .draglayer .nsdrag"
    );
    const xAxisLayers = plotRef.current.querySelectorAll(
      ".main-svg .draglayer .ewdrag"
    );

    const allAxisLayers = [...yAxisLayers, ...xAxisLayers];

    allAxisLayers.forEach((layer) => {
      layer.addEventListener("contextmenu", handleRightClick);
    });

    return () => {
      allAxisLayers.forEach((layer) => {
        layer.removeEventListener("contextmenu", handleRightClick);
      });
    };
  });

  return {
    showAxisRangeInput,
    axisRangeInputPosition,
    clickedAxis,
    clickedAxisType,
    setShowAxisRangeInput,
  };
};
