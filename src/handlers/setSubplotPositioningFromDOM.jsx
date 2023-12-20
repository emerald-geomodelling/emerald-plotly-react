import { underlaying_subplot } from "../utils";

export const setSubplotPositioningFromDOM = (
  plotRef,
  plot,
  plotdef,
  setSubplotPositioning
) => {
  const plotDiv = plotRef.current;
  if (!plotDiv) return;
  const dragLayer = plotDiv.querySelector(".main-svg .draglayer");
  if (!dragLayer) return;
  const infoLayer = plotDiv.querySelector(".main-svg .infolayer");
  if (!infoLayer) return;

  const plotSizes = Object.fromEntries(
    Array.prototype.slice
      .call(dragLayer.children)
      .map((el) => [el.classList[0], el.getBBox()])
  );

  const overlaying = Object.fromEntries(
    Object.keys(plotSizes).map((plotName) => [
      plotName,
      underlaying_subplot(plotName, plot),
    ])
  );

  const inverseMapping = (obj) => {
    return Object.fromEntries(
      Array.from(new Set(Object.values(obj))).map((value) => [
        value,
        Object.entries(obj)
          .filter(([name, value2]) => value2 === value)
          .map(([name, value]) => name),
      ])
    );
  };

  const underlaying = inverseMapping(overlaying);

  const subplotPositioning = Object.fromEntries(
    Object.keys(plotSizes).map((plotName) => {
      return [
        plotName,
        {
          bbox: plotSizes[plotName],
          overlaying: overlaying[plotName],
          underlaying: underlaying[plotName],
        },
      ];
    })
  );

  // Colorbar css classes look like "cbcoloraxis2 colorbar"
  const coloraxisPositioning = Object.fromEntries(
    Array.from(infoLayer.querySelectorAll(".colorbar")).map((el) => [
      el.classList[0].slice(2),
      {
        bbox: el.getBBox(),
        unit: plotdef.layout[el.classList[0].slice(2)]?.unit,
      },
    ])
  );

  if (setSubplotPositioning) {
    setSubplotPositioning({
      subplots: subplotPositioning,
      coloraxis: coloraxisPositioning,
    });
  }
};
