# emerald-plotly-react

emerald-plotly-react is an extension to the renowned data visualization library, Plotly. Our module is designed to enhance and simplify your data visualization experience by offering additional functionality that seamlessly integrates with Plotly's core features.

### Key Features

- **Separation of concerns:** We've innovated the way you handle plot specifications and data transformations. With emerald-plotly-react, you can independently define what to plot and how to plot it, streamlining the process of creating complex visualizations with multiple subplots.
- **Flexible layout:** Customize your plot layouts with ease. Our enhanced layout configurations offering additional flexibility, giving you more control over your visualization's appearance.
- **Zoom management:** Additional zoom functionality.
- **Subplot editor:** Allowing to plot multiple subplots with a custom editor that makes it possible to edit the subplot traces on the fly.
- **Customisable subplot menu:** Each subplot has a custom menu which you can add as many custom items you want to.

## Installation guide

Installing emerald-plotly-react is straightforward using npm. Here's how you can add it to your project:

#### Navigate to your project directory

- Use the **`cd`** command to go to the directory where you want to install emerald-plotly-react.

#### Install

```
npm install emerald-plotly-react
```

#### Verify the Installation

- After installation, you can check your **node_modules** folder to see if emerald-plotly-react and its dependencies have been installed correctly.

## Getting Started

### Here is a full [Example Project](https://github.com/emerald-geomodelling/emerald-plotly-react-example)

To help you get started with `emerald-plotly-react`, here's an example of how you can use the `BasePlot` component within a React application:

```javascript
import React, { useState } from "react";
import { BasePlot } from "emerald-plotly-react";

const element_radtemp = {
  fn: function (context, args) {
    return [
      {
        type: "scattergl",
        x: context.radial.dist,
        y: context.radial.temp,
      },
    ];
  },
  xaxis: "dist",
  yaxis: "temp",
  schema: (context) => {
    // Json-schema for `args` parameter to `fn` above, used to generate a form in the edit menu.
    return {
      type: "object",
      required: [],
      properties: {},
      additionalProperties: false,
    };
  },
};

export const elements = {
  traces: { "Radial temperature": element_radtemp },
  xaxis: {
    // Units used on x-axes
    dist: {
      title: { text: "distance (m)" },
    },
  },
  yaxis: {
    // Units used on y-axes
    temp: {
      title: {
        text: "temperature (deg c)",
      },
    },
  },
};

const initial_layout = {
  layout: {
    grid: {
      columns: 2,
      pattern: "independent",
      roworder: "bottom to top",
      rows: 2,
      subplots: [
        ["xy", "x2y2"],
        ["x3y3", "x4y4"],
      ],
      xgap: 0,
      ygap: 0.0,
    },
  },
  traces: [{ "Radial temperature": { xaxis: "x", yaxis: "y" } }],
};

const PlotContainer = () => {
  const [plotLayout, setPlotLayout] = useState(initial_layout);

  // Data that can be plotted; typically you'd use typed arrays here
  let context = {
    radial: {
      dist: [1, 2, 3],
      temp: [30.2, 31.3, 30.9],
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BasePlot
        context={context}
        plot={structuredClone(plotLayout)} // Deep copy of plot layout to avoid direct state mutation
        setPlot={setPlotLayout}
        elements={elements}
      />
    </div>
  );
};

export default PlotContainer;
```

## Architecture

A plot layout consists of plot a set of subplots, each subplot holding
any number of plot elements. Each plot element (e.g. element_radtemp
in the example above) can be used multiple times in the same subplot
with different parameters. Data used by the plot elements is stored in
a context object. Each plot element has a specific unit of measure for
their x and y axis, and only plot elements that share the same units
for their axes can be plotted in the same subplot (or, if subplots
share axes, in subplots that share that axis).

### Plot elements

A plot element defines how to plot some data. It consist of an object
with a few required (and some optional) properties and methods:
`xaxis`, `yaxis`, `fn`, `schema`. `xaxis` and `yaxis` give the units
of measure for the two axes (note: not the actual axes of whatever
subplot this is used in). `fn` generates a list of plotly traces to be
plotted given a context object and optional arguments. `schema`
finally gives a [JSON-schema](https://json-schema.org/) for the
optional arguments of `fn`.

### Plot context

The plot context is an object that holds all data that can be plotted.
No particular structure is enforced for the plot context object. It is
available to all plot element methods.

### Units

As mentioned above, plot elements need to specify the units of measure
of the two axes. No special syntax is enforced for this, and you can
just make up names. They are matched against the unit names of other
elements the user tries to add to the same subplot, and only elements
with the same units are allowed to share the same axis. Additionally,
plotly axis configuration (such as text styling, title, tick marks
etc) can be applied to each unit.

### Layouts

A layout is an object that specifies a plotly layout and a set of plot
element instances to plot. The layout can be modified by the use using
the cogwheel menu on each subplot and colorbar. It therefore needs to
live in a react state, and you can easily implement save/load
functionality for the user as it is a pure JS object that can be
serialized to JSON.

---

## `BasePlot` Component API Reference

The `BasePlot` component is a wrapper around Plotly's `Plot` component, integrating custom subplot management, zoom control, and dynamic plot updating.

| Key                     | Description                                                                                                                                                                                                                                 | Type            | Default               | Required |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------- | -------- |
| `context`               | The context object containing environmental data or configurations.                                                                                                                                                                         | Object          | None                  | Yes      |
| `plot`                  | The plot configuration object, specifying how the plot should be rendered.                                                                                                                                                                  | Object          | None                  | Yes      |
| `setPlot`               | Function to update the plot configuration.                                                                                                                                                                                                  | Function        | None                  | Yes      |
| `elements`              | Array of elements or data points for the plot.                                                                                                                                                                                              | Array           | None                  | Yes      |
| `subplotZooms`          | A state or context-managed object that retains zoom levels for subplots, enabling their use for further optimizations. If not provided, a local state within the component manages the zoom levels by default.                              | Object          | localSubplotZooms     | No       |
| `setSubplotZooms`       | Function to update the zoom levels of subplots.                                                                                                                                                                                             | Function        | handleSetSubplotZooms | No       |
| `currentDragMode`       | Specifies the current drag mode for plot interaction.                                                                                                                                                                                       | String          | `null`                | No       |
| `selections`            | A state object that holds the selection details which can be utilized for further actions or processing within the plot. This state can be managed by a parent component or through a context to enable interaction with selected elements. | Object          | `null`                | No       |
| `setSelections`         | Function to update the selections on the plot.                                                                                                                                                                                              | Function        | None                  | No       |
| `ignore_errors`         | Determines whether to ignore errors during plotting.                                                                                                                                                                                        | Boolean         | `true`                | No       |
| `onPlotUpdate`          | Callback function for plot updates.                                                                                                                                                                                                         | Function        | `null`                | No       |
| `useDefaultModebar`     | Controls visibility of the default Plotly modebar.                                                                                                                                                                                          | Boolean         | `true`                | No       |
| `additionalMenuItems`   | Additional items for the custom menu.                                                                                                                                                                                                       | Array<Object>   | `[]`                  | No       |
| `customSubplotEditor`   | Custom component for editing subplots.                                                                                                                                                                                                      | React.Component | `null`                | No       |
| `customColoraxisEditor` | Custom component for editing color axis.                                                                                                                                                                                                    | React.Component | `null`                | No       |
| `useDefaultSchema`      | Whether to use the full Plotly schema.                                                                                                                                                                                                      | Boolean         | `true`                | No       |
| `children`              | JSX or components to display when no plot is shown.                                                                                                                                                                                         | React.Node      | None                  | No       |
| `...restProps`          | Additional props passed to the underlying `Plot` component.                                                                                                                                                                                 | Object          | None                  | No       |

### Additional Menu Items Example

The `BasePlot` component allows for the addition of custom menu items. Below is an example demonstrating how to define and use `additionalMenuItems`:

#### Defining Custom Menu Items

First, define your custom menu items. You can include icons and specify click event handlers:

```javascript
const extraMenuItems = [
  {
    icon: <ion-icon name="heart-outline"></ion-icon>, // Icon for the menu item
    label: "Custom Item 1", // Label for the menu item
    onClick: () => console.log("Custom Item 1 clicked"), // Click handler for the menu item, add functionality that you want
  },
];
```

To use these extraMenuItems, simply pass them as a prop to the `BasePlot` component:

```javascript
<BasePlot
  // ... other props
  additionalMenuItems={extraMenuItems}
/>
```

## `CustomMenu` Component API Reference

The `CustomMenu` component provides a custom context menu interface, allowing for additional interaction with plot elements. It supports custom menu items and editors for subplot and color axis customization.

### Props

| Key                     | Description                                                                                                                                                                                                                                              | Type            | Default                  | Required |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------ | -------- |
| `plot`                  | The current plot configuration.                                                                                                                                                                                                                          | Object          | None                     | Yes      |
| `setPlot`               | Function to update the plot configuration.                                                                                                                                                                                                               | Function        | None                     | Yes      |
| `elements`              | Array of elements or data points for the plot.                                                                                                                                                                                                           | Array           | None                     | Yes      |
| `element`               | The element object representing the target plot area.                                                                                                                                                                                                    | Object          | None                     | Yes      |
| `context`               | The context object containing environmental data or configurations.                                                                                                                                                                                      | Object          | None                     | Yes      |
| `setShowLegend`         | Function to toggle the visibility of the legend.                                                                                                                                                                                                         | Function        | None                     | Yes      |
| `setSelectedElement`    | Function to set the currently selected plot element.                                                                                                                                                                                                     | Function        | None                     | Yes      |
| `additionalMenuItems`   | Additional items to be added to the custom menu.                                                                                                                                                                                                         | Array<Object>   | `[]`                     | No       |
| `customSubplotEditor`   | A custom component for editing subplot details. If provided, this component replaces the default editor and must be capable of handling props for `plot`, `setPlot`, `elements`, `context`, and `subplotName` to interact with the plot's configuration. | React.Component | `DefaultSubplotEditor`   | No       |
| `customColoraxisEditor` | A custom component for editing the color axis details. Similar to `customSubplotEditor`, this replaces the default color axis editor and must interface with the same props expected by the default editor.                                              | React.Component | `DefaultColoraxisEditor` | No       |
| `useDefaultSchema`      | Determines if the default or full Plotly schema should be used for the color axis editor.                                                                                                                                                                | Boolean         | `true`                   | No       |

Note: When using `customSubplotEditor` or `customColoraxisEditor`, ensure that the custom components you provide are designed to interact with the plot's data structure and update functions as the default editors do. If no custom editors are provided, `CustomMenu` utilizes its built-in editors that are already equipped to handle the necessary props and provide the appropriate UI for editing subplot and color axis details.

## `CustomMenuPopup` Component API Reference

The `CustomMenuPopup` component displays a contextual popup with dynamic content. It is versatile and can adapt its position to prevent edge overflow, providing a smooth user experience.

### Props

| Key             | Description                                                                                                                                                                                                                                                         | Type       | Default | Required |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- | -------- |
| `content`       | The content displayed inside the popup. This is typically a component or HTML elements.                                                                                                                                                                             | React.Node | None    | Yes      |
| `clickPosition` | An object detailing the popup's position, which should be a state updated upon a click. Refer to the `CustomMenu` source for implementation details. It needs to contain x and y coordinates, along with clientWidth and clientHeight for positioning calculations. | Object     | None    | Yes      |
| `setShowPopup`  | A function that updates the visibility state of the popup, typically used to hide the popup when a click occurs outside of it.                                                                                                                                      | Function   | None    | Yes      |

#### Example of state update

```javascript
setPopupPosition({
  x: element.x,
  y: element.y,
  clientWidth: element.clientWidth,
  clientHeight: element.clientHeight,
});
```

#### Import

```javascript
import { CustomMenuPopup } from "emerald-plotly-react";
```

## `elementPlotting` API Reference

| Function                                                        | Description                                                          | Parameters                                                            | Returns                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------- |
| `merge(a, b)`                                                   | Merges two objects, handling data types and combining arrays.        | `a`: Object, `b`: Object                                              | Merged Object                   |
| `axis_tracename2layoutname(tracename)`                          | Converts a trace name to a layout name as per Plotly's convention.   | `tracename`: String                                                   | Layout Name String              |
| `split_axis_tracename(tracename)`                               | Splits a combined axis trace name into separate `xaxis` and `yaxis`. | `tracename`: String                                                   | Object with `xaxis` and `yaxis` |
| `underlaying_subplot(axis_tracename, plot)`                     | Determines the underlying subplot for a given axis trace name.       | `axis_tracename`: String, `plot`: Object                              | Subplot Name String             |
| `instantiate_plot(plot, elements, context, ignore_errors)`      | Instantiates a plot configuration with user-defined specs.           | `plot`, `elements`, `context`, `ignore_errors`: Boolean               | Enhanced Plot Object            |
| `subplot_specification(axis, plot_specification)`               | Retrieves specification for a subplot based on axis names.           | `axis`: String, `plot_specification`: Object                          | Subplot Specification Object    |
| `subplot_elements(axis, plot_specification, elements, context)` | Determines applicable plot elements for a given subplot.             | `axis`: String, `plot_specification`, `elements`, `context`: Object   | Subplot Elements Object         |
| `component_schema(name, elements, context)`                     | Generates a JSON schema for a specified component.                   | `name`: String, `elements`, `context`: Object                         | JSON Schema Object              |
| `subplot_schema(axis, plot_specification, elements, context)`   | Creates a JSON schema for subplots with axis unit compatibility.     | `axis`: String, `plot_specification`, `elements`, `context`: Object   | JSON Schema Object              |
| `apply_selections(elements, context, eventData, action)`        | Applies a selection action to components in a plot.                  | `elements`, `context`: Object, `eventData`: Event, `action`: Function | None                            |

### Usage

These functions are used in building dynamic plotting applications with Plotly, allowing for customization and interaction based on user input or data changes.

## License

`MIT`
