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

#### Import

```javascript
import { BasePlot } from "emerald-plotly-react";
```

#### You can also check out this [Example Project](https://github.com/emerald-geomodelling/emerald-plotly-react-example)

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

## `CustomMenu` Component API Reference

The `CustomMenu` component provides a custom context menu interface, allowing for additional interaction with plot elements. It supports custom menu items and editors for subplot and color axis customization.

### Props

| Key                     | Description                                                                               | Type          | Default                  | Required |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------------- | ------------------------ | -------- |
| `plot`                  | The current plot configuration.                                                           | Object        | None                     | Yes      |
| `setPlot`               | Function to update the plot configuration.                                                | Function      | None                     | Yes      |
| `elements`              | Array of elements or data points for the plot.                                            | Array         | None                     | Yes      |
| `element`               | The element object representing the target plot area.                                     | Object        | None                     | Yes      |
| `context`               | The context object containing environmental data or configurations.                       | Object        | None                     | Yes      |
| `setShowLegend`         | Function to toggle the visibility of the legend.                                          | Function      | None                     | Yes      |
| `setSelectedElement`    | Function to set the currently selected plot element.                                      | Function      | None                     | Yes      |
| `additionalMenuItems`   | Additional items to be added to the custom menu.                                          | Array<Object> | `[]`                     | No       |
| `customSubplotEditor`   | Custom component for editing subplot details.                                             | Component     | `DefaultSubplotEditor`   | No       |
| `customColoraxisEditor` | Custom component for editing the color axis details.                                      | Component     | `DefaultColoraxisEditor` | No       |
| `useDefaultSchema`      | Determines if the default or full Plotly schema should be used for the color axis editor. | Boolean       | `true`                   | No       |

Note: The `DefaultSubplotEditor` and `DefaultColoraxisEditor` are placeholders for whatever your default components are, if not overridden by props.

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
