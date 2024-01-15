export const calculatePlotElementsPositions = (plotElement, plotLayout) => {
  const positions = [];
  const clientWidth = plotElement.clientWidth;
  const clientHeight = plotElement.clientHeight;

  // Extract subplot names from the layout
  const subplotNames = plotLayout.grid.subplots.flat();

  const dragLayer = plotElement.querySelector(".main-svg .draglayer");
  const infoLayer = plotElement.querySelector(".main-svg .infolayer");
  if (!dragLayer || !infoLayer) return positions;

  // Handle subplots
  Array.from(dragLayer.children).forEach((el) => {
    const bbox = el.getBBox();
    const x = bbox.x + bbox.width;
    const y = bbox.y;

    const subplotName =
      subplotNames.find((name) => el.classList.contains(name)) || "unknown";
    positions.push({
      x,
      y,
      subplotName,
      type: "subplot",
      clientWidth,
      clientHeight,
    });
  });

  // Handle colorbars
  Array.from(infoLayer.querySelectorAll(".colorbar")).forEach((el) => {
    const bbox = el.getBBox();
    const x = bbox.x + bbox.width;
    const y = bbox.y;

    const colorbarName = el.classList[0].slice(2);
    const colorbarUnit = plotLayout[el.classList[0].slice(2)]?.unit;

    if (colorbarUnit === undefined) {
      return;
    }

    positions.push({
      x,
      y,
      colorbarName,
      colorbarUnit,
      type: "colorbar",
      clientWidth,
      clientHeight,
    });
  });

  return positions;
};
