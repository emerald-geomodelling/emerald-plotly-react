import React from "react";
import BasePlot from "../BasePlot/BasePlot";

const InteractivePlot = ({ children }) => {
  return (
    <div className="h-[100%] w-[100%] p-1 rounded-md bg-white relative">
      <BasePlot>{children}</BasePlot>
    </div>
  );
};

export default InteractivePlot;
