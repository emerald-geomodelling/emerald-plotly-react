import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

import { handlePlotElementClick } from "../../handlers";
import { usePlotConfiguration } from "../../hooks";
import { calculatePlotElementsPositions } from "../../utils";

import CustomMenu from "../CustomMenu";
import AxisRangeInput from "../AxisRangeInput";

const BasePlot = ({
  context,
  plot,
  elements,
  subplotZooms,
  setSubplotZooms,
  children,
  ignore_errors,
  selections,
  setSelections,
  currentDragMode,
  ...restProps
}) => {
  const [showLegend, setShowLegend] = useState(false);
  const [isPlotReady, setIsPlotReady] = useState(false);
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
      setIsPlotReady(true);
    }
  };

  const onSelected = (eventData) => {
    const serialized = JSON.stringify(eventData?.selections);
    if (serialized !== selections?.serialized) {
      setSelections({
        serialized: serialized,
        points: eventData?.points,
        selections: eventData?.selections,
      });
    }
  };

  const onRelayout = (layout) => {
    console.log("handle relayout");
    saveZoomStateOnRelayout({
      layout,
      setSubplotZooms,
      subplotZooms,
    });
  };

  const toggleLegendVisibility = () => {
    setShowLegend((prevShowLegend) => !prevShowLegend);
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
        onSelected={onSelected}
        onRelayout={onRelayout}
        {...restProps}
      />

      {subplotPositions.map((element, index) => (
        <CustomMenu
          key={index}
          element={element}
          toggleLegend={toggleLegendVisibility}
        />
      ))}

      {isPlotReady && (
        <AxisRangeInput
          plotRef={plotRef}
          subplotZooms={subplotZooms}
          setSubplotZooms={setSubplotZooms}
        />
      )}
    </div>
  );
};

export default BasePlot;
