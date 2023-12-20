import React from "react";
import Plot from "react-plotly.js";

import {
  handlePlotElementClick,
  setSubplotPositioningFromDOM,
} from "../../handlers";
import { usePlotConfiguration } from "../../hooks/usePlotConfiguration";

const BasePlot = ({
  context,
  plot,
  elements,
  setSubplotPositioning,
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

  const onUpdate = () => {
    setSubplotPositioningFromDOM(
      plotRef,
      plot,
      plotConfig,
      setSubplotPositioning
    );
  };

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
        onAfterPlot={onUpdate}
        onSelected={handleSelected}
        {...restProps}
      />
    </div>
  );
};

export default BasePlot;
