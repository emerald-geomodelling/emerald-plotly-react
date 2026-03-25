import { useEffect } from "react";
import { instantiate_plot } from "../elementPlotting";
import {
  initializeLegendForPlot,
  updateSubplotTitles,
  updateZoomForPlot,
} from "../handlers";

export const usePlotConfiguration = (
  plot,
  context,
  elements,
  ignore_errors,
  subplotZooms,
  showLegend,
  selectedElement,
  setPlotConfig,
  hiddenTraceNames
) => {
  useEffect(() => {
    if (!context || !plot) {
      setPlotConfig(null);
      return;
    }

    let instantiatedPlot = instantiate_plot(
      plot,
      elements,
      context,
      ignore_errors
    );
    instantiatedPlot = updateZoomForPlot(instantiatedPlot, subplotZooms);
    instantiatedPlot = updateSubplotTitles(
      plot,
      instantiatedPlot,
      elements,
      context
    );
    instantiatedPlot = initializeLegendForPlot(
      instantiatedPlot,
      showLegend,
      selectedElement,
      hiddenTraceNames
    );
    setPlotConfig(instantiatedPlot);
  }, [context, plot, ignore_errors, elements, subplotZooms, showLegend, hiddenTraceNames]); // eslint-disable-line
};
