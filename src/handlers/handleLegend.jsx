export const getUpdatedTracesForLegendGroups = (plotdef, showLegend) => {
  return plotdef.traces.map((trace) => {
    return {
      ...trace,
      showlegend: showLegend,
    };
  });
};

export const initializeLegendForPlot = (
  plotdef,
  selectedSubplot,
  showLegend
) => {
  const updatedTraces = getUpdatedTracesForLegendGroups(
    plotdef,
    selectedSubplot
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
