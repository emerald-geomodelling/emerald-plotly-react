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
  subplotZooms, // state for storing the zoom levels
  setSubplotZooms, // saving zoom levels
  currentDragMode = null,
  selections = null,
  setSelections = null,

  ignore_errors = true,
  onPlotUpdate = null, // Callback for plot updates
  useDefaultModebar = true, // Handles visibility of default plotly modebar
  additionalMenuItems = [], // adds additional items to the custom menu
  customSubplotEditor = null, // if you want to use your own editor pass a component here
  customColoraxisEditor = null, // if you want to use your own editor pass a component here
  useDefaultSchema = true, // set to false if you want to use the full plotly schema

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
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPlotReady, setIsPlotReady] = useState(false);
  const [plotConfig, setPlotConfig] = useState(null);
  const plotRef = useRef(null);

  const [localSubplotZooms, setLocalSubplotZooms] = useState(null);

  const handleSetSubplotZooms = (zoomData) => {
    if (setSubplotZooms) {
      setSubplotZooms(zoomData);
    } else {
      setLocalSubplotZooms(zoomData);
    }
  };

  const effectiveSubplotZooms = subplotZooms || localSubplotZooms;

  usePlotConfiguration(
    plot,
    context,
    elements,
    ignore_errors,
    effectiveSubplotZooms,
    showLegend,
    selectedElement,
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
    if (handleSetSubplotZooms && effectiveSubplotZooms) {
      saveZoomStateOnRelayout({
        layout,
        setSubplotZooms: handleSetSubplotZooms,
        subplotZooms: effectiveSubplotZooms,
      });
    }
  };

  const plotlyPlotConfig = useMemo(
    () => ({
      responsive: true,
      displaylogo: false,
      displayModeBar: useDefaultModebar,
      doubleClick: false,
      scrollZoom: true,
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
    <div ref={plotRef} style={{ width: "100%", height: "100%" }}>
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
          element={element}
          context={context}
          setShowLegend={setShowLegend}
          setSelectedElement={setSelectedElement}
          additionalMenuItems={additionalMenuItems}
          customSubplotEditor={customSubplotEditor}
          customColoraxisEditor={customColoraxisEditor}
          useDefaultSchema={useDefaultSchema}
        />
      ))}

      {isPlotReady && (
        <AxisRangeInput
          plotRef={plotRef}
          subplotZooms={effectiveSubplotZooms}
          setSubplotZooms={handleSetSubplotZooms}
        />
      )}
    </div>
  );
};

export default BasePlot;
