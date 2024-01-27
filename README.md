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

| Key                     | Description                                                                | Type            | Default | Required |
| ----------------------- | -------------------------------------------------------------------------- | --------------- | ------- | -------- |
| `context`               | The context object containing environmental data or configurations.        | Object          | None    | Yes      |
| `plot`                  | The plot configuration object, specifying how the plot should be rendered. | Object          | None    | Yes      |
| `setPlot`               | Function to update the plot configuration.                                 | Function        | None    | Yes      |
| `elements`              | Array of elements or data points for the plot.                             | Array           | None    | Yes      |
| `subplotZooms`          | State object for storing zoom levels of subplots.                          | Object          | `{}`    | No       |
| `setSubplotZooms`       | Function to update the zoom levels of subplots.                            | Function        | None    | No       |
| `currentDragMode`       | Specifies the current drag mode for plot interaction.                      | String          | `null`  | No       |
| `selections`            | Object representing the current selections on the plot.                    | Object          | `null`  | No       |
| `setSelections`         | Function to update the selections on the plot.                             | Function        | None    | No       |
| `ignore_errors`         | Determines whether to ignore errors during plotting.                       | Boolean         | `true`  | No       |
| `onPlotUpdate`          | Callback function for plot updates.                                        | Function        | `null`  | No       |
| `useDefaultModebar`     | Controls visibility of the default Plotly modebar.                         | Boolean         | `true`  | No       |
| `additionalMenuItems`   | Additional items for the custom menu.                                      | Array<Object>   | `[]`    | No       |
| `customSubplotEditor`   | Custom component for editing subplots.                                     | React.Component | `null`  | No       |
| `customColoraxisEditor` | Custom component for editing color axis.                                   | React.Component | `null`  | No       |
| `useDefaultSchema`      | Whether to use the full Plotly schema.                                     | Boolean         | `true`  | No       |
| `children`              | JSX or components to display when no plot is shown.                        | React.Node      | None    | No       |
| `...restProps`          | Additional props passed to the underlying `Plot` component.                | Object          | None    | No       |
