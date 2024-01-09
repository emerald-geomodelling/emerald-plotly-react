import React, { useState } from "react";
import { JsonEditorWrapper } from "emerald-json-editor-react";

const CustomJsonEditor = ({ schema, setSubplotData, subplotData }) => {
  const [data, setData] = useState(subplotData);

  return (
    <div className="custom-json-editor">
      <JsonEditorWrapper schema={schema} data={data} setData={setData} />
      <button
        onClick={() => setSubplotData(data)}
        className="w-full h-7 text-sm bg-transparent py-1 px-2 border border-1 border-slate-300 rounded-md z-50 hover:border-purple-500 mt-2"
      >
        Apply
      </button>
    </div>
  );
};

export default CustomJsonEditor;
