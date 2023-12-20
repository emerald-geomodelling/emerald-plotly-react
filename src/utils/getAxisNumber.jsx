export const getYAxisNumber = (plotName) => {
  const match = plotName.match(/y(\d+)/);
  return match ? match[1] : "";
};

export const getXAxisNumber = (plotName) => {
  const match = plotName.match(/x(\d+)/);
  return match ? match[1] : "";
};
