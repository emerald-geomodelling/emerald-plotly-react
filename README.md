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

### Props

#### `context`: Object

- **Description**: The context object containing environmental data or configurations.
- **Type**: `Object`

#### `plot`: Object

- **Description**: The plot configuration object.
- **Type**: `Object`

#### `setPlot`: Function

- **Description**: Function to update the plot configuration.
- **Type**: `Function`

#### `elements`: Array

- **Description**: Array of elements or data points for the plot.
- **Type**: `Array`

#### `subplotZooms`: Object

- **Description**: State object for storing zoom levels of subplots.
- **Type**: `Object`
- **Default**: `undefined`

#### `setSubplotZooms`: Function

- **Description**: Function to update the zoom levels of subplots.
- **Type**: `Function`

#### `currentDragMode`: String

- **Description**: Specifies the current drag mode for plot interaction.
- **Type**: `String`
- **Default**: `null`

#### `selections`: Object

- **Description**: Object representing the current selections on the plot.
- **Type**: `Object`
- **Default**: `null`

#### `setSelections`: Function

- **Description**: Function to update the selections on the plot.
- **Type**: `Function`
- **Default**: `null`

#### `ignore_errors`: Boolean

- **Description**: Determines whether to ignore errors during plotting.
- **Type**: `Boolean`
- **Default**: `true`

#### `onPlotUpdate`: Function

- **Description**: Callback function for plot updates.
- **Type**: `Function`
- **Default**: `null`

#### `useDefaultModebar`: Boolean

- **Description**: Controls visibility of the default Plotly modebar.
- **Type**: `Boolean`
- **Default**: `true`

#### `additionalMenuItems`: Array

- **Description**: Additional items for the custom menu.
- **Type**: `Array<Object>`
- **Default**: `[]`

#### `customSubplotEditor`: Component

- **Description**: Custom component for editing subplots.
- **Type**: `React.Component`
- **Default**: `null`

#### `customColoraxisEditor`: Component

- **Description**: Custom component for editing color axis.
- **Type**: `React.Component`
- **Default**: `null`

#### `useDefaultSchema`: Boolean

- **Description**: Whether to use the full Plotly schema.
- **Type**: `Boolean`
- **Default**: `true`

#### `children`: Node

- **Description**: JSX or components to display when no plot is shown.
- **Type**: `React.Node`

#### `...restProps`

- **Description**: Additional props passed to the underlying `Plot` component.
