import React, { useEffect, useMemo, useRef, useState } from "react";
import Plot from "react-plotly.js";

import {
  handlePlotElementClick,
  saveZoomStateOnRelayout,
} from "../../handlers";
import { usePlotConfiguration } from "../../hooks";
import { calculatePlotElementsPositions } from "../../utils";

import CustomMenu from "../CustomMenu";
import AxisRangeInput from "../AxisRangeInput";

const BasePlot = ({
  context,
  plot,
  setPlot,
  elements,

  // Optional props with default values
  subplotZooms = null,
  setSubplotZooms = null,
  currentDragMode = null,
  selections = null,
  setSelections = null,

  ignore_errors = true,
  onPlotUpdate = null, // Callback for plot updates
  useDefaultModebar = true, // Handles visibility of default plotly modebar

  children,
  ...restProps
}) => {
  /* Wrapper around <react-plotly.Plot /> and ElementPlotting.
  props:
    plot, context, elements: Same meanings as the arguments to
      ElementPlotting.instantiate_plot()
  setSubplotPositioning:
      Function that will be called after each rerendering with an object of the form
        {subplotAxisName: {bbox: {x, y, width, height},
                           overlaying: subplotAxisName,
                           underlaying: [subplotAxisName, subplotAxisName...]}}
    children: JSX to show when no plot is shown (e.g. plot or context is null)
  Any additional props are sent on to <react-plotly.Plot />
  */

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
      onPlotUpdate && onPlotUpdate(plotConfig);
    }
  };

  const onSelected = (eventData) => {
    if (setSelections) {
      const serialized = JSON.stringify(eventData?.selections);
      if (serialized !== selections?.serialized) {
        setSelections({
          serialized: serialized,
          points: eventData?.points,
          selections: eventData?.selections,
          /*
        components: eventData?.selections?.map((selection) => {
          return plot.traces.filter(
            (trace) =>
              Object.values(trace)[0].xaxis == selection.xref &&
              Object.values(trace)[0].yaxis == selection.yref
          );
        }),
        */
        });
      }
    }
  };

  const onRelayout = (layout) => {
    if (setSubplotZooms && subplotZooms) {
      saveZoomStateOnRelayout({
        layout,
        setSubplotZooms,
        subplotZooms,
      });
    }
  };

  const plotlyPlotConfig = useMemo(
    () => ({
      responsive: true,
      displaylogo: false,
      displayModeBar: useDefaultModebar,
      doubleClick: false,
    }),
    [useDefaultModebar]
  );

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
        config={plotlyPlotConfig}
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
          plot={plot}
          setPlot={setPlot}
          elements={elements}
          context={context}
          element={element}
          setShowLegend={setShowLegend}
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
