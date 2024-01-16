import schema from "./plotly-schema.json"; // assert { type: "json" }; // This should really be Plotly.PlotSchema.get()

export const defaultSchema = {
  "type": "object",
  "properties": {
    "cmin": {
      "type": "number",
      "default": null,
    },
    "cmax": {
      "type": "number",
      "default": null,
    },

    "colorscale": {
      "type": "string",
      "enum": [
        "Greys",
        "YlGnBu",
        "Greens",
        "YlOrRd",
        "Bluered",
        "RdBu",
        "Reds",
        "Blues",
        "Picnic",
        "Rainbow",
        "Portland",
        "Jet",
        "Hot",
        "Blackbody",
        "Earth",
        "Electric",
        "Viridis",
        "Cividis",
      ],
      "default": null,
    },
  },
  "additionalProperties": false,
};

const plotlyfragment2jsonschema = (fragment) => {
  if (typeof fragment !== "object") {
    return { enum: [fragment] }; // Const might not work well in json editor...
  }

  if (
    fragment.valType === undefined &&
    fragment.items === undefined &&
    fragment.attributes === undefined &&
    fragment.layoutAttributes === undefined
  ) {
    return {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(fragment)
          .filter(
            ([key, val]) =>
              ["description", "editType", "role"].indexOf(key) < 0 &&
              key[0] !== "_"
          )
          .map(([key, value]) => [key, plotlyfragment2jsonschema(value)])
      ),
      additionalProperties: false,
    };
  }

  const res = {};

  const attrs = fragment.attributes || fragment.layoutAttributes;
  if (attrs) {
    res.properties = Object.fromEntries(
      Object.entries(attrs).map(([key, value]) => [
        key,
        plotlyfragment2jsonschema(value),
      ])
    );
    res.additionalProperties = false;
  }

  if (fragment.valType !== undefined) {
    if (fragment.valType === "enumerated") {
      res.type = typeof fragment.values[fragment.values.length - 1];
      res["enum"] = fragment.values;
    } else if (fragment.valType === "any") {
      // Pass
    } else if (fragment.valType === "data_array") {
      res.type = "array";
      res.format = "table";
      res.items = { type: "integer" };
    } else if (fragment.valType === "angle") {
      res.type = "number";
      res.minimum = -180;
      res.maximum = 180;
    } else if (fragment.valType === "color") {
      res.type = "string";
      res.format = "color";
      res.options = {
        colorpicker: {
          editorFormat: "rgb",
        },
      };
    } else if (fragment.valType === "colorlist") {
      res.type = "array";
      res.format = "table";
      res.items = {
        type: "string",
        format: "color",
        options: {
          colorpicker: {
            editorFormat: "rgb",
          },
        },
      };
    } else if (fragment.valType === "colorscale") {
      res.type = "string";
      res["enum"] = [
        "Greys",
        "YlGnBu",
        "Greens",
        "YlOrRd",
        "Bluered",
        "RdBu",
        "Reds",
        "Blues",
        "Picnic",
        "Rainbow",
        "Portland",
        "Jet",
        "Hot",
        "Blackbody",
        "Earth",
        "Electric",
        "Viridis",
        "Cividis",
      ];
    } else if (fragment.valType === "subplotid") {
      res.type = "string";
      res["enum"] =
        [res.dflt] +
        Array.from({ length: 10 }, (value, index) =>
          index === 0 ? res.dflt : res.dflt + (index + 1)
        );
    } else {
      res.type = fragment.valType;
    }
  }

  if (fragment.dflt !== undefined) res["default"] = fragment.dflt;
  if (fragment.max !== undefined) res.maximum = fragment.max;
  if (fragment.min !== undefined) res.minimum = fragment.min;

  if (fragment.description !== undefined) {
    res.description = fragment.description;
  } else if (fragment.meta?.description !== undefined) {
    res.description = fragment.meta.description;
  }

  if (fragment.items !== undefined) {
    res.type = "array";
    res.format = "table";
    res.title = Object.keys(fragment.items);
    res.items = plotlyfragment2jsonschema(Object.values(fragment.items)[0]);
  }

  return res;
};

const plotly2jsonschema = (schema) => {
  //schema.defs

  return {
    properties: Object.fromEntries(
      Object.entries(schema).map(([key, value]) => [
        key,
        plotlyfragment2jsonschema(value),
      ])
    ),
  };
};

export const fullPlotlySchema = plotly2jsonschema(schema.schema);