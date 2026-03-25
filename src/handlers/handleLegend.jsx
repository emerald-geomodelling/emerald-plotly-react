export const getUpdatedTracesForLegendGroups = (
  plotdef,
  showLegend,
  selectedElement,
  hiddenTraceNames
) => {
  return plotdef.traces.map((trace) => {
    const elementIdentifier = `${trace.xaxis}${trace.yaxis}`;

    const shouldShowLegend =
      showLegend && elementIdentifier === selectedElement;

    const isHidden = hiddenTraceNames && hiddenTraceNames.has(trace.name);

    return {
      ...trace,
      showlegend: shouldShowLegend,
      ...(isHidden ? { visible: "legendonly" } : {}),
    };
  });
};

export const initializeLegendForPlot = (
  plotdef,
  showLegend,
  selectedElement,
  hiddenTraceNames
) => {
  const updatedTraces = getUpdatedTracesForLegendGroups(
    plotdef,
    showLegend,
    selectedElement,
    hiddenTraceNames
  );
  return {
    ...plotdef,
    traces: updatedTraces,
    layout: {
      ...plotdef.layout,
      showlegend: showLegend,
      legend: {
        ...plotdef.layout.legend,
        groupclick: "toggleitem",
        x: 1,
        y: 0,
        xanchor: "right",
        yanchor: "bottom",
        traceorder: "normal",
        font: {
          family: "sans-serif",
          size: 13,
          color: "#000",
        },
        bgcolor: "#ffffff",
        bordercolor: "#ffffff",
        borderwidth: 10,
        tracegroupgap: 20,
        itemwidth: 10,
      },
    },
  };
};
