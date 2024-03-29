import React from "react";
import { JsonEditorWrapper } from "emerald-json-editor-react";

const DefaultColoraxisEditor = ({
  plot,
  setPlot,
  elements,
  element,
  schema,
}) => {
  if (!element || !plot) return null;

  let currentConfig = plot.layout[element.colorbarName];
  if (currentConfig === undefined)
    currentConfig = JSON.parse(
      JSON.stringify(elements.coloraxis[element.colorbarUnit])
    );

  const setColoraxisData = (data) => {
    const new_plot = JSON.parse(JSON.stringify(plot));
    data.unit = element.colorbarUnit;
    new_plot.layout[element.colorbarName] = data;

    setPlot(new_plot);
  };

  return (
    <div className="custom-json-editor coloraxis">
      <h4 className="editorTitle">
        {element.colorbarName} ({element.colorbarUnit})
      </h4>

      <JsonEditorWrapper
        schema={schema}
        data={currentConfig}
        setData={(data) => setColoraxisData(data)}
        disable_properties={false}
      />
    </div>
  );
};

export default DefaultColoraxisEditor;
