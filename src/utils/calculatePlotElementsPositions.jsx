import { split_axis_tracename } from "../elementPlotting";

export const calculatePlotElementsPositions = (plotElement, plotLayout) => {
  const positions = [];
  const clientWidth = plotElement.clientWidth;
  const clientHeight = plotElement.clientHeight;

  // Extract subplot names from the layout
  const subplotNames = plotLayout.grid.subplots.flat();

  // Build reverse map: split y-axis name -> original y-axis name.
  // The y-axis splitting code in instantiate_plot tags split axes with
  // _originalYaxis so the settings wheel can look up traces in the
  // pre-split plot specification.
  const splitYaxisMap = {};
  Object.keys(plotLayout).forEach((key) => {
    const m = key.match(/^yaxis(\d*)$/);
    if (m && plotLayout[key]._originalYaxis) {
      const yName = m[1] ? "y" + m[1] : "y";
      splitYaxisMap[yName] = plotLayout[key]._originalYaxis;
    }
  });

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

    // Map back to the pre-split subplot name so subplot_specification
    // and subplot_elements can find traces in the original spec
    let resolvedName = subplotName;
    if (subplotName !== "unknown") {
      const { xaxis: xa, yaxis: ya } = split_axis_tracename(subplotName);
      const originalYa = splitYaxisMap[ya] || ya;
      if (originalYa !== ya) {
        resolvedName = xa + originalYa;
      }
    }

    positions.push({
      x,
      y,
      subplotName: resolvedName,
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
