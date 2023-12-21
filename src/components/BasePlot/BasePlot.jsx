import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

import { handlePlotElementClick } from "../../handlers";
import { usePlotConfiguration } from "../../hooks";
import { calculatePlotElementsPositions } from "../../utils";

import CustomMenu from "../CustomMenu";

const BasePlot = ({
  context,
  plot,
  elements,
  subplotZooms,
  showLegend,
  children,
  ignore_errors,
  selections,
  setSelections,
  currentDragMode,
  ...restProps
}) => {
  const [plotConfig, setPlotConfig] = useState(null);
  const plotRef = useRef(null);

  usePlotConfiguration(
    plot,
    context,
    elements,
    ignore_errors,
    subplotZooms,
    showLegend,
    setPlotConfig
  );

  useEffect(() => {
    if (!plotRef.current) return;
    plotRef.current.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      true
    );
  }, [plotRef]);

  const [subplotPositions, setSubplotPositions] = useState([]);

  const onAfterPlot = () => {
    if (plotRef.current && plotConfig && plotConfig.layout) {
      const positions = calculatePlotElementsPositions(
        plotRef.current,
        plotConfig.layout
      );
      setSubplotPositions(positions);
    }
  };

  const handleSelected = (eventData) => {
    const serialized = JSON.stringify(eventData?.selections);
    if (serialized !== selections?.serialized) {
      setSelections({
        serialized: serialized,
        points: eventData?.points,
        selections: eventData?.selections,
      });
    }
  };

  if (!plotConfig) return children;

  if (plotConfig) {
    if (plotConfig.layout === undefined) plotConfig.layout = {};
    plotConfig.layout.dragmode = currentDragMode;
    plotConfig.layout.selections = selections?.selections;
  }

  return (
    <div className="h-[100%] w-[100%]" ref={plotRef}>
      <Plot
        data={plotConfig.traces}
        layout={plotConfig.layout}
        onClick={(ev) => {
          handlePlotElementClick(ev, elements, context);
        }}
        onAfterPlot={onAfterPlot}
        onSelected={handleSelected}
        {...restProps}
      />

      {subplotPositions.map((element, index) => (
        <CustomMenu key={index} element={element} />
      ))}
    </div>
  );
};

export default BasePlot;
