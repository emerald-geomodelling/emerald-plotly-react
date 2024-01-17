import React, { useState } from "react";
import { JsonEditorWrapper } from "emerald-json-editor-react";

const CustomJsonEditor = ({ schema, setSubplotData, subplotData }) => {
  const [data, setData] = useState(subplotData);

  return (
    <div className="custom-json-editor">
      <JsonEditorWrapper schema={schema} data={data} setData={setData} />
      <button onClick={() => setSubplotData(data)} className="apply-button">
        Apply
      </button>
    </div>
  );
};

export default CustomJsonEditor;
