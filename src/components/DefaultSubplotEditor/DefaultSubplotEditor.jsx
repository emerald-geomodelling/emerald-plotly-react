import React from "react";
import CustomJsonEditor from "./CustomJsonEditor";

import {
  split_axis_tracename,
  subplot_schema,
  subplot_specification,
} from "../../utils";

const DefaultSubplotEditor = ({
  plot,
  setPlot,
  elements,
  context,
  subplotName,
}) => {
  const dataInSubplot = subplot_specification(subplotName, plot);
  const updateSubplotSchema = subplot_schema(
    subplotName,
    plot,
    elements,
    context
  );

  const updateSubplotData = (subplotName, dataInSubplot) => {
    const axis = split_axis_tracename(subplotName);

    const others = plot.traces.filter(
      (component) =>
        Object.values(component)[0].xaxis !== axis.xaxis ||
        Object.values(component)[0].yaxis !== axis.yaxis
    );

    let these = JSON.parse(JSON.stringify(dataInSubplot));
    if (!these || these.length === 0) {
      these = [{ none: {} }];
    }

    these.forEach((component) => {
      const args = Object.values(component)[0];
      args.xaxis = axis.xaxis;
      args.yaxis = axis.yaxis;
    });

    const new_plot = JSON.parse(JSON.stringify(plot));
    new_plot.traces = others.concat(these);

    setPlot(new_plot);
  };

  const setSubplotDataWrapper = (dataInSubplot) =>
    updateSubplotData(subplotName, dataInSubplot);

  return (
    <div className="w-[350px]">
      <CustomJsonEditor
        schema={updateSubplotSchema}
        setSubplotData={setSubplotDataWrapper}
        subplotData={dataInSubplot}
      />
    </div>
  );
};

export default DefaultSubplotEditor;
