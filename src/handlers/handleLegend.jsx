export const getUpdatedTracesForLegendGroups = (
  plotdef,
  showLegend,
  selectedElement
) => {
  return plotdef.traces.map((trace) => {
    const elementIdentifier = `${trace.xaxis}${trace.yaxis}`;

    const shouldShowLegend =
      showLegend && elementIdentifier === selectedElement;

    return {
      ...trace,
      showlegend: shouldShowLegend,
    };
  });
};

export const initializeLegendForPlot = (
  plotdef,
  showLegend,
  selectedElement
) => {
  const updatedTraces = getUpdatedTracesForLegendGroups(
    plotdef,
    showLegend,
    selectedElement
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
