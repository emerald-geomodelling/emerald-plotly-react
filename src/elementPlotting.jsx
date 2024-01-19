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

 Note: elements sharing an axis, must have the same unit name for
 that axis! This is enforced, and mixing elements with different
 axis units will throw an exception.

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

  var instantiate_trace = function (name, args) {
    var tracedef = elements.traces[name];
    if (tracedef === undefined) {
      const err = new Error(`component ${name} does not exist`);
      if (!ignore_errors) throw err;
      console.error(err);
      return;
    }
    if (!tracedef.xaxis) {
    } else if (xaxis[args.xaxis] === undefined) {
      xaxis[args.xaxis] = tracedef.xaxis;
      var layoutname = axis_tracename2layoutname(args.xaxis);
      if (res.layout[layoutname] === undefined) res.layout[layoutname] = {};
      Object.assign(res.layout[layoutname], elements.xaxis[tracedef.xaxis]);
    } else {
      if (xaxis[args.xaxis] !== tracedef.xaxis) {
        const err = new Error(
          `Component trace has different x axis unit to existing elements in the same subplot.
          X axis: ${args.xaxis}
          Component: ${name}
          Component unit: ${tracedef.xaxis}
          Existing unit: ${xaxis[args.xaxis]}
          `
        );
        if (!ignore_errors) throw err;
        console.error(err);
        return;
      }
    }
    if (!tracedef.yaxis) {
    } else if (yaxis[args.yaxis] === undefined) {
      yaxis[args.yaxis] = tracedef.yaxis;
      layoutname = axis_tracename2layoutname(args.yaxis);
      if (res.layout[layoutname] === undefined) res.layout[layoutname] = {};
      res.layout[layoutname] = merge(
        res.layout[layoutname],
        elements.yaxis[tracedef.yaxis]
      );
    } else {
      if (yaxis[args.yaxis] !== tracedef.yaxis) {
        const err = new Error(
          `Component trace has different y axis unit to existing elements in the same subplot.
          Y axis: ${args.yaxis}
          Component: ${name}
          Component unit: ${tracedef.yaxis}
          Existing unit: ${yaxis[args.yaxis]}
          `
        );
        if (!ignore_errors) throw err;
        console.error(err);
        return;
      }
    }
    if (tracedef.fn) {
      res.traces.push.apply(
        res.traces,
        tracedef.fn(context, args).map(function (trace) {
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
        tracedef.shapes(context, args).map(function (shape) {
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

  for (var i in plot.traces) {
    var trace = plot?.traces[i];
    if (typeof trace === "string") {
      instantiate_trace(trace, {});
    } else {
      for (var name in trace) {
        instantiate_trace(name, trace[name]);
      }
    }
  }

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
        Object.keys(trace) !== "none"
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

  const xaxis_units = plot_specification.traces
    .filter((trace) => {
      const args = Object.values(trace)[0];
      return (
        args.xaxis === subplot.xaxis && !Object.keys(trace).includes("none")
      );
    })
    .map((trace) => Object.keys(trace)[0])
    .map((name) => elements.traces[name].xaxis);
  const yaxis_units = plot_specification.traces
    .filter((trace) => {
      const args = Object.values(trace)[0];
      return (
        args.yaxis === subplot.yaxis && !Object.keys(trace).includes("none")
      );
    })
    .map((trace) => Object.keys(trace)[0])
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
  const { allowed_component_names, disabled_component_names } =
    subplot_elements(axis, plot_specification, elements, context);

  return {
    type: "array",
    items: {
      anyOf: allowed_component_names
        .map((name) => component_schema(name, elements, context))
        .filter((schema) => schema !== false),
      disabledAnyOf: disabled_component_names
        .map((name) => component_schema(name, elements, context))
        .filter((schema) => schema !== false),
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
