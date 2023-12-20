export const saveZoomStateOnRelayout = ({
  layout,
  setSubplotZooms,
  subplotZooms,
}) => {
  const newZooms = { ...subplotZooms };

  for (let key in layout) {
    if (key.includes(".range[")) {
      const axisName = key.split(".")[0];
      const rangeIndex = key.endsWith("[0]") ? 0 : 1;

      if (!newZooms[axisName]) newZooms[axisName] = { range: [null, null] };
      newZooms[axisName].range[rangeIndex] = layout[key];
    }
  }
  setSubplotZooms(newZooms);
};

export const resetZoom = ({ setSubplotZooms }) => {
  setSubplotZooms({});
};

export const moveToStartOfXAxis = ({ setSubplotZooms, subplotZooms }) => {
  const updatedZooms = { ...subplotZooms };

  for (let axis in updatedZooms) {
    if (axis.startsWith("xaxis") && updatedZooms[axis].range) {
      const zoomSpan =
        updatedZooms[axis].range[1] - updatedZooms[axis].range[0];
      updatedZooms[axis].range = [0, zoomSpan];
    }
  }
  setSubplotZooms(updatedZooms);
};

export const moveToEndOfXAxis = ({
  setSubplotZooms,
  subplotZooms,
  nodeDetails,
  selectedLineId,
}) => {
  const updatedZooms = { ...subplotZooms };
  const selectedLineIdBigInt = BigInt(selectedLineId);
  const line = nodeDetails?.measured.flightlines.xdist.filter(function (
    el,
    idx
  ) {
    return nodeDetails?.measured.flightlines.Line[idx] === selectedLineIdBigInt;
  });

  const lineXdistMax = line[line?.length - 1];
  const maxX = lineXdistMax; /* retrieve the maximum x value here */

  for (let axis in updatedZooms) {
    if (axis.startsWith("xaxis") && updatedZooms[axis].range) {
      const zoomSpan =
        updatedZooms[axis].range[1] - updatedZooms[axis].range[0];
      updatedZooms[axis].range = [maxX - zoomSpan, maxX];
    }
  }

  setSubplotZooms(updatedZooms);
};

export const setAxisZoomRange = ({
  setSubplotZooms,
  subplotZooms,
  desiredRange,
  desiredRangeMin,
  axisName,
}) => {
  const updatedZooms = { ...subplotZooms };

  if (!updatedZooms[axisName]) {
    updatedZooms[axisName] = { range: [desiredRangeMin, desiredRange] };
  } else {
    updatedZooms[axisName].range = [desiredRangeMin, desiredRange];
  }
  setSubplotZooms(updatedZooms);
};

export const resetAxis = ({ subplotZooms, setSubplotZooms, axisName }) => {
  const updatedZooms = { ...subplotZooms };

  if (!updatedZooms[axisName]) {
    updatedZooms[axisName] = { range: [] };
  } else {
    updatedZooms[axisName].range = [];
  }

  setSubplotZooms(updatedZooms);
};

export const updateZoomForPlot = (plotdef, subplotZooms) => {
  const updatedPlot = { ...plotdef };
  updatedPlot.layout = { ...updatedPlot.layout };

  for (let axis in subplotZooms) {
    if (subplotZooms[axis].range) {
      if (!updatedPlot.layout[axis]) updatedPlot.layout[axis] = {};
      updatedPlot.layout[axis] = { ...updatedPlot.layout[axis] };
      updatedPlot.layout[axis].range = subplotZooms[axis].range;
    }
  }
  return updatedPlot;
};
