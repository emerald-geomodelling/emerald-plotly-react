/*

 This module is a mini library on top of Plotly. It lets you separate
 the specification of what to plot together and in what subplots etc,
 from the data to plot and the functions that transforms that data
 into specific traces.

 Plot input is separated into two parts: plot and elements.

 ## Format description for elements ##

 An object with three members, traces and xaxis and yaxis.

 "traces" is a registry of traces elements for Plotly. Each list a
 function (fn) that generates traces objects, and an xaxis and yaxis
 unit name.

 These unit names are used to look up axis definitions in the "xaxis"
 and "yaxis" keys. These will be applied to the actual axis the
 component is used for (using the Plotly "layout" parameter).

 Note: elements sharing an axis in the same subplot cell must have the
 same unit name for that axis! This is enforced, and mixing elements
 with different axis units in the same cell will throw an exception.
 Elements in different grid columns sharing a y-axis name are allowed
 to have different units — the y-axis splitting code will give each
 column its own independent axis.

 ## Format description for plot ##

 Object with two properties, "traces" and "layout". "layout" has the
 same syntax as the layout parameter to Plotly.newPlot.

 "traces" is a list of object, each object of the form {componentname:
 {args}}, where componentname is one of the keys in
 elements.traces. The function in that component will be run
 with a context object as fist parameter, and args as the second
 parameter, and should return Plotly trace objects. Args must include
 xaxis and yaxis (with the same meaning as for Plotly traces).

 The component also specifies the axis units for its two axis, and only
 elements using the same units for an axis, can share that axis in
 the plot (this is checked ad runtime).

*/

export const merge = (a, b) => {
  if (b === undefined) {
    return a;
  } else if (a === undefined) {
    return b;
  } else if (b === null) {
    return b;
  } else if (typeof b !== "object") {
    return b;
  } else if (Array.isArray(b)) {
    return b;
    /*
    if (!Array.isArray(a)) {
      return b;
    } else {
      return a.concat(b);
    }
    */
  } else {
    return Object.fromEntries(
      Array.from(new Set(Object.keys(a).concat(Object.keys(b)))).map((k) => [
        k,
        merge(a[k], b[k]),
      ])
    );
  }
};

export const axis_tracename2layoutname = function (tracename) {
  // Yes, really. Why didn't they use the same naming convention? x2 vs xaxis2?
  return tracename[0] + "axis" + tracename.slice(1);
};

export const split_axis_tracename = (tracename) => {
  const pos = tracename.indexOf("y");
  return { xaxis: tracename.slice(0, pos), yaxis: tracename.slice(pos) };
};

export const underlaying_subplot = (axis_tracename, plot) => {
  let { xaxis, yaxis } = split_axis_tracename(axis_tracename);
  let [uxaxis, uyaxis] = [xaxis, yaxis];
  do {
    xaxis = uxaxis;
    uxaxis = plot?.layout[axis_tracename2layoutname(xaxis)]?.overlaying;
  } while (uxaxis);
  do {
    yaxis = uyaxis;
    uyaxis = plot?.layout[axis_tracename2layoutname(yaxis)]?.overlaying;
  } while (uyaxis);

  return xaxis + yaxis;
};

const none_tracedef = {
  fn: (context, args) => {
    return [
      {
        name: "none",
        x: [],
        y: [],
      },
    ];
  },
  yaxis: null,
  xaxis: null,
  schema: (context) => ({ type: "object", additionalProperties: false }),
};

export const instantiate_plot = function (
  plot,
  elements,
  context,
  ignore_errors
) {
  var xaxis = {};
  var yaxis = {};
  var res = JSON.parse(JSON.stringify(plot)); // deep copy
  res.traces = [];
  res.layout.shapes = [];

  // Pre-compute which axes span multiple grid columns/rows.
  // Used to make unit validation column-aware: traces in different
  // columns of the same y-axis can have different units because the
  // splitting code (below) will give each column its own axis.
  const gridYaxisCols = {};
  const gridXaxisRows = {};
  if (plot.layout?.grid?.subplots) {
    plot.layout.grid.subplots.forEach((row) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell) => {
        if (!cell) return;
        const { xaxis: xa, yaxis: ya } = split_axis_tracename(cell);
        if (!gridYaxisCols[ya]) gridYaxisCols[ya] = new Set();
        gridYaxisCols[ya].add(xa);
        if (!gridXaxisRows[xa]) gridXaxisRows[xa] = new Set();
        gridXaxisRows[xa].add(ya);
      });
    });
  }

  // Column-qualified validation key: when a y-axis spans multiple
  // columns, qualify with x-axis so each column validates independently.
  const yaxisKey = (ya, xa) =>
    gridYaxisCols[ya]?.size > 1 ? ya + "@" + xa : ya;
  const xaxisKey = (xa, ya) =>
    gridXaxisRows[xa]?.size > 1 ? xa + "@" + ya : xa;

  // Track per-column y-axis units for the splitting code to use
  const yaxisColUnit = {};

  var instantiate_trace = function (name, args) {
    var tracedef = name === "none" ? none_tracedef : elements.traces[name];
    if (tracedef === undefined) {
      throw new Error(`component ${name} does not exist`);
    }
    if (!tracedef.xaxis) {
    } else {
      const xkey = xaxisKey(args.xaxis, args.yaxis);
      if (xaxis[xkey] === undefined) {
        xaxis[xkey] = tracedef.xaxis;
        var layoutname = axis_tracename2layoutname(args.xaxis);
        if (res.layout[layoutname] === undefined) res.layout[layoutname] = {};
        Object.assign(res.layout[layoutname], elements.xaxis[tracedef.xaxis]);
      } else {
        if (xaxis[xkey] !== tracedef.xaxis) {
          throw new Error(
            `Component trace has different x axis unit to existing elements in the same subplot.
          X axis: ${args.xaxis}
          Component: ${name}
          Component unit: ${tracedef.xaxis}
          Existing unit: ${xaxis[xkey]}
          `
          );
        }
      }
    }
    if (!tracedef.yaxis) {
    } else {
      const ykey = yaxisKey(args.yaxis, args.xaxis);
      if (yaxis[ykey] === undefined) {
        yaxis[ykey] = tracedef.yaxis;
        layoutname = axis_tracename2layoutname(args.yaxis);
        if (res.layout[layoutname] === undefined) res.layout[layoutname] = {};
        // Only apply axis layout config for the first column (when qualified
        // key matches unqualified). The splitting code applies the correct
        // config for subsequent columns.
        if (ykey === args.yaxis) {
          res.layout[layoutname] = merge(
            res.layout[layoutname],
            elements.yaxis[tracedef.yaxis]
          );
        }
      } else {
        if (yaxis[ykey] !== tracedef.yaxis) {
          throw new Error(
            `Component trace has different y axis unit to existing elements in the same subplot.
          Y axis: ${args.yaxis}
          Component: ${name}
          Component unit: ${tracedef.yaxis}
          Existing unit: ${yaxis[ykey]}
          `
          );
        }
      }
      // Track per-column unit for the splitting code
      if (!yaxisColUnit[args.yaxis]) yaxisColUnit[args.yaxis] = {};
      yaxisColUnit[args.yaxis][args.xaxis] = tracedef.yaxis;
    }
    if (tracedef.fn) {
      res.traces.push.apply(
        res.traces,
        tracedef.fn(context, args, elements).map(function (trace) {
          trace.xaxis = args.xaxis;
          trace.yaxis = args.yaxis;
          trace.xaxis_unit = tracedef.xaxis;
          trace.yaxis_unit = tracedef.yaxis;
          trace.component = name;
          trace.args = args;
          return trace;
        })
      );
    }
    if (tracedef.shapes) {
      res.layout.shapes.push.apply(
        res.layout.shapes,
        tracedef.shapes(context, args, elements).map(function (shape) {
          if (shape.xref === undefined || shape.xref === "x")
            shape.xref = args.xaxis;
          if (shape.yref === undefined || shape.yref === "y")
            shape.yref = args.yaxis;
          shape.xaxis_unit = tracedef.xaxis;
          shape.yaxis_unit = tracedef.yaxis;
          shape.component = name;
          shape.args = args;
          return shape;
        })
      );
    }
  };

  var missing_subplots = {};
  for (var i in plot.traces) {
    var trace = plot?.traces[i];
    if (typeof trace === "string") {
      console.warn(
        "Deprecation warning: Unsupported old trace definition with only name"
      );
      try {
        instantiate_trace(trace, {});
      } catch (err) {
        if (!ignore_errors) throw err;
        console.error(err);
      }
    } else {
      for (var name in trace) {
        missing_subplots[trace[name].xaxis + " " + trace[name].yaxis] = true;
        try {
          instantiate_trace(name, trace[name]);
        } catch (err) {
          if (!ignore_errors) throw err;
          console.error(err);
        }
      }
    }
  }

  res.traces.map((trace) => {
    delete missing_subplots[trace.xaxis + " " + trace.yaxis];
  });

  Object.keys(missing_subplots).map((subplot) => {
    const [xaxis, yaxis] = subplot.split(" ");
    res.traces.push({
      name: "none",
      x: [],
      y: [],
      xaxis: xaxis,
      yaxis: yaxis,
      xaxis_unit: null,
      yaxis_unit: null,
      component: "none",
      args: {},
    });
  });

  const unit_by_coloraxes = Object.fromEntries(
    Object.entries(res.layout)
      .filter(
        ([name, value]) => name.slice(0, "coloraxis".length) === "coloraxis"
      )
      .map(([name, value]) => [name, value.unit])
  );
  const coloraxis_by_unit = Object.fromEntries(
    Object.entries(unit_by_coloraxes).map(([name, unit]) => [unit, name])
  );

  let first_free_coloraxis = 1;
  const add_color_axis = (unit) => {
    if (coloraxis_by_unit[unit]) return coloraxis_by_unit[unit];
    let name;
    do {
      name = `coloraxis${
        first_free_coloraxis === 1 ? "" : first_free_coloraxis
      }`;
      first_free_coloraxis++;
    } while (unit_by_coloraxes[name] !== undefined);
    unit_by_coloraxes[name] = unit;
    coloraxis_by_unit[unit] = name;
    res.layout[name] = { unit: unit };
    return name;
  };

  res.traces.forEach((trace) => {
    if (trace.marker?.coloraxis) {
      add_color_axis(trace.marker.coloraxis);
    }
    if (trace.marker?.line?.coloraxis) {
      add_color_axis(trace.marker.line.coloraxis);
    }
  });

  res.traces.forEach((trace) => {
    if (trace.marker?.coloraxis) {
      trace.marker.coloraxis = coloraxis_by_unit[trace.marker.coloraxis];
    }
    if (trace.marker?.line?.coloraxis) {
      trace.marker.line.coloraxis =
        coloraxis_by_unit[trace.marker.line.coloraxis];
    }
  });

  Object.entries(unit_by_coloraxes).forEach(([name, unit]) => {
    const unit_config = elements.coloraxis[unit];
    if (unit_config !== undefined) {
      res.layout[name] = merge(unit_config, res.layout[name]);
    }
  });

  // Split shared y-axes across x-axis columns.
  // When a y-axis appears in multiple columns of the subplot grid (e.g. xy5
  // and x2y5), Plotly renders tick labels only at the axis anchor position —
  // typically the left column. To show tick labels in every column we replace
  // the shared reference with an independent axis linked via "matches" so
  // zoom stays synchronised (when units match) or fully independent (when
  // units differ).
  if (res.layout.grid?.subplots) {
    const yaxisCols = {};
    res.layout.grid.subplots.forEach((row, ri) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell, ci) => {
        if (!cell) return;
        const { xaxis: xa, yaxis: ya } = split_axis_tracename(cell);
        if (!yaxisCols[ya]) yaxisCols[ya] = {};
        if (!yaxisCols[ya][xa]) yaxisCols[ya][xa] = [];
        yaxisCols[ya][xa].push({ ri, ci });
      });
    });

    const usedNums = new Set([1]);
    Object.keys(res.layout).forEach((k) => {
      const m = k.match(/^yaxis(\d*)$/);
      if (m) usedNums.add(m[1] ? parseInt(m[1]) : 1);
    });
    res.traces.forEach((t) => {
      if (t.yaxis) {
        const n = t.yaxis === "y" ? 1 : parseInt(t.yaxis.slice(1));
        if (!isNaN(n)) usedNums.add(n);
      }
    });
    let nextY = Math.max(...usedNums) + 1;

    Object.entries(yaxisCols).forEach(([ya, xaMap]) => {
      const xaxes = Object.keys(xaMap);
      if (xaxes.length <= 1) return;

      const origLayout = axis_tracename2layoutname(ya);
      const firstColXa = xaxes[0];

      xaxes.slice(1).forEach((xa) => {
        const num = nextY++;
        const newY = "y" + num;
        const newLayout = "yaxis" + num;

        // Check if this column has a different unit than the first column
        const colUnit = yaxisColUnit[ya]?.[xa];
        const firstColUnit = yaxisColUnit[ya]?.[firstColXa];
        const unitsDiffer = colUnit && firstColUnit && colUnit !== firstColUnit;

        if (unitsDiffer) {
          // Different units: apply the correct unit's axis config,
          // do NOT set matches (independent zoom)
          res.layout[newLayout] = elements.yaxis[colUnit]
            ? JSON.parse(JSON.stringify(elements.yaxis[colUnit]))
            : {};
        } else {
          // Same units: copy from original, link via matches for synced zoom
          res.layout[newLayout] = res.layout[origLayout]
            ? JSON.parse(JSON.stringify(res.layout[origLayout]))
            : {};
          res.layout[newLayout].matches = ya;
        }
        res.layout[newLayout].showticklabels = true;
        // Tag with original axis name so the settings wheel can map back
        res.layout[newLayout]._originalYaxis = ya;

        xaMap[xa].forEach(({ ri, ci }) => {
          res.layout.grid.subplots[ri][ci] = xa + newY;
        });

        res.traces.forEach((t) => {
          if (t.yaxis === ya && t.xaxis === xa) {
            t.yaxis = newY;
          }
        });
      });
    });
  }

  return res;
};

export const subplot_specification = (axis, plot_specification) => {
  const subplot = split_axis_tracename(axis);
  return plot_specification.traces
    .filter((trace) => {
      const args = Object.values(trace)[0];
      return (
        args.xaxis === subplot.xaxis &&
        args.yaxis === subplot.yaxis &&
        !Object.keys(trace).includes("none")
      );
    })
    .map((trace) => {
      trace = JSON.parse(JSON.stringify(trace));
      delete Object.values(trace)[0].xaxis;
      delete Object.values(trace)[0].yaxis;
      return trace;
    });
};

export const subplot_elements = (
  axis,
  plot_specification,
  elements,
  context
) => {
  const subplot = split_axis_tracename(axis);

  // Filter by both axes to scope to the exact subplot cell.
  // This ensures traces in different grid columns with different units
  // don't constrain each other's allowed trace types.
  const xaxis_units = plot_specification.traces
    .filter((trace) => {
      const args = Object.values(trace)[0];
      return (
        args.xaxis === subplot.xaxis &&
        args.yaxis === subplot.yaxis &&
        !Object.keys(trace).includes("none")
      );
    })
    .map((trace) => Object.keys(trace)[0])
    .filter((name) => elements.traces[name])
    .map((name) => elements.traces[name].xaxis);
  const yaxis_units = plot_specification.traces
    .filter((trace) => {
      const args = Object.values(trace)[0];
      return (
        args.xaxis === subplot.xaxis &&
        args.yaxis === subplot.yaxis &&
        !Object.keys(trace).includes("none")
      );
    })
    .map((trace) => Object.keys(trace)[0])
    .filter((name) => elements.traces[name])
    .map((name) => elements.traces[name].yaxis);

  const all_component_names = Object.keys(elements.traces).filter(
    (name) => name !== "none"
  );

  let allowed_component_names = all_component_names;
  if (xaxis_units.length) {
    allowed_component_names = allowed_component_names.filter(
      (name) => elements.traces[name].xaxis === xaxis_units[0]
    );
  }
  if (yaxis_units.length) {
    allowed_component_names = allowed_component_names.filter(
      (name) => elements.traces[name].yaxis === yaxis_units[0]
    );
  }

  const disabled_component_names = all_component_names.filter(
    (name) => allowed_component_names.indexOf(name) < 0
  );

  // All these are just lists of string names of elements!
  return {
    all_component_names,
    allowed_component_names,
    disabled_component_names,
  };
};

export const component_schema = (name, elements, context) => {
  try {
    const component_schema = elements.traces[name].schema(context);
    if (component_schema === false) return false;
    component_schema.type = "object";
    component_schema.title = name;
    return {
      type: "object",
      title: name,
      required: [name],
      additionalProperties: false,
      properties: Object.fromEntries([[name, component_schema]]),
    };
  } catch (e) {
    console.error(
      `Plot component ${name} failed to report a schema:\n${e.stack}`
    );
    return false;
  }
};

export const subplot_schema = (axis, plot_specification, elements, context) => {
  const { all_component_names } =
    subplot_elements(axis, plot_specification, elements, context);

  // Include ALL elements in anyOf regardless of axis unit matching.
  // Axis-mismatched elements are handled gracefully by instantiate_plot
  // (ignore_errors=true), and the JSON editor has no concept of
  // "disabled" options — disabledAnyOf was ignored by @json-editor.
  let anyOf = all_component_names
    .map((name) => component_schema(name, elements, context))
    .filter((schema) => schema !== false);

  // Ensure anyOf is never empty — the JSON editor cannot handle an
  // empty anyOf and shows a cryptic validation error.
  if (anyOf.length === 0) {
    anyOf.push({
      type: "object",
      title: "none",
      required: ["none"],
      additionalProperties: false,
      properties: {
        none: { type: "object", additionalProperties: false, title: "none" },
      },
    });
  }

  return {
    type: "array",
    items: {
      anyOf,
    },
  };
};

export const apply_selections = (elements, context, eventData, action) => {
  const components = new Map();
  eventData.points.forEach((p) => {
    let args, points;
    if (!components.has(p.data.component)) {
      args = new Map();
      components.set(p.data.component, args);
    } else {
      args = components.get(p.data.component);
    }
    if (!args.has(p.data.args)) {
      points = [];
      args.set(p.data.args, points);
    } else {
      points = args.get(p.data.args);
    }
    points.push(p);
  });

  for (const [component, argss] of components) {
    for (const [args, points] of argss) {
      if (elements.traces[component].apply_selections !== undefined) {
        elements.traces[component].apply_selections(
          context,
          args,
          points,
          action
        );
      }
    }
  }
};
