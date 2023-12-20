export const handlePlotElementClick = (ev, elements, plotContext) => {
  const component = elements.traces[ev.points[0].data.component];
  const xaxis = elements.xaxis[ev.points[0].data.xaxis_unit];
  const yaxis = elements.yaxis[ev.points[0].data.yaxis_unit];

  if (component.onClick)
    component.onClick(ev, plotContext, ev.points[0].data.args);
  if (xaxis.onClick)
    xaxis.onClick(
      ev,
      plotContext,
      ev.points[0].data.component,
      ev.points[0].data.args
    );
  if (yaxis.onClick)
    yaxis.onClick(
      ev,
      plotContext,
      ev.points[0].data.component,
      ev.points[0].data.args
    );
};
