export const coloraxisJsonSchema = {
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
