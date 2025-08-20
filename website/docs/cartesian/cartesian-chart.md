# Cartesian Chart

The `CartesianChart` component is the core component of `victory-native`. Its core responsibilities are:

- accepting raw data that you'd eventually like to chart, as well as some configuration around charting (such as options for axes, etc.)
- transforming that raw data into a format that can be easily accessed and used for charting with other `victory-native` components.

## Example

The example below shows a basic use of the `CartesianChart`.

```tsx
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
// 👇 import a font file you'd like to use for tick labels
import inter from "../assets/inter-medium.ttf";

function MyChart() {
  const font = useFont(inter, 12);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA} // 👈 specify your data
        xKey="day" // 👈 specify data key for x-axis
        yKeys={["lowTmp", "highTmp"]} // 👈 specify data keys used for y-axis
        axisOptions={{ font }} // 👈 we'll generate axis labels using given font.
      >
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => (
          // 👇 and we'll use the Line component to render a line path.
          <Line points={points.highTmp} color="red" strokeWidth={3} />
        )}
      </CartesianChart>
    </View>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  lowTmp: 20 + 10 * Math.random(),
  highTmp: 40 + 30 * Math.random(),
}));
```

## Props

### `data` (required)

An array of objects to be used as data points for the chart.

### `xKey` (required)

A `string` value indicating the _key_ of each `data[number]` object to be used on the independent (x) axis for charting. E.g. `"day"` if you want to use the `"day"` field of the data points for the x-axis.

:::info
The `xKey` prop must be a key for a field that has either a `number` or `string` type, as these are the values that can be reasonably serialized by Reanimated.
:::

### `yKeys` (required)

A `string[]` array of string indicating the _keys_ of each `data[number]` object to be used on the dependent (y) axis for charting. E.g. `yKeys={["lowTmp", "highTmp"]}` if you want to chart both high and low temperatures on the y-axis and those values have keys of `lowTmp` and `highTmp` respectively.

This prop accepts an _array_ of strings because the `CartesianChart` supports multiple ranges (e.g. plotting both high and low temperatures), and the `CartesianChart` component needs to know about all of the slices of the dataset you plan to plot (to e.g. determine the total range of the chart).

:::info
The `yKeys` prop must be keys for fields that have `number` values. That is, only `number`s can be used as dependent values for charting purposes.
:::

### `children` (required)

The `children` prop is a render function whose sole argument is an object that exposes transformed data for you to use in your drawing operations. For example, the `children` render function's argument has a `points` field that exposes a version of your input data that's transformed to be plotted on the Canvas (see [the Example section](#example) above for an example of this).

**See the [Render Function Fields](#render-function-fields) section for an outline of all of the available fields on the render function argument.**

The `children` function will render its Skia elements inside of [a clipping group](https://shopify.github.io/react-native-skia/docs/group/#clipping-operations) that sit inside of the bounds of the charts axes, so that your charting elements do not overflow outside of your axes.

### `padding`

A `number` or an object of shape `{ left?: number; right?: number; top?: number; bottom?: number; }` that specifies that padding between the outer bounds of the Skia canvas and where the charting bounds will occur.

For example, passing `padding={{ left: 20, bottom: 20 }}` will add 20 Density Independent Pixels (DIPs) of space to the bottom and left of the chart, but have the chart "bleed" to the right and top. Passing `padding={20}` will add 20 DIPs of space to all sides.

### `domain`

An object of shape `{ x?: [number] | [number, number]; y?: [number] | [number, number] }` that can be specified to control the upper and lower bounds of each axis. It defaults to the min and max of each range respectively.

For example, passing `domain={{y: [-10, 100]}}` will result in a y-axis with a lower bound of `-10` and an upper bound of `100`. For `domain={{x: [1, 4]}}`, will result in an x-axis contained within those bounds.

### `viewport`

An object of shape `{ x?: [number, number]; y?: [number, number] }` that controls the visible range of the chart. Unlike `domain` which sets the absolute bounds of the data, `viewport` determines what portion of the data is currently visible in the chart window.

For example, if your data spans from 0-100 on the x-axis, setting `viewport={{ x: [25, 75] }}` will zoom the chart to show only the data between x=25 and x=75. This is particularly useful for implementing features like:

- Initial zoom level
- Programmatically controlling the visible range
- Creating preset view windows for different data ranges

The viewport can be combined with `transformState` to allow user interaction (pan/zoom) within the specified range.

### `domainPadding`

A `number` or an object of shape `{ left?: number; right?: number; top?: number; bottom?: number; }` that specifies that padding between the outer bounds of the _charting area_ (e.g. where the axes lie) and where chart elements will be plotted.

For example, passing `padding={{ left: 20, right: 20 }}` will add 20 DIPs of space between the edges of the chart and where the line/bar/area graph will start.

### `axisOptions` <i>deprecated</i>

:::warning
While the `axisOptions` prop is still supported, it is deprecated in favor of the `xAxis` and `yAxis` and `frame` props. The `axisOptions` prop may be removed in a future release.
:::

The `axisOptions` is an optional prop allows you to configure the axes and grid of the chart. If it is not present then the chart will not render any axes or grid. It is an object of the following **optional** properties:

|      Property       | Type                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :-----------------: | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     **`font`**      | <pre>SkFont &#124; null</pre>                                                                                                      | Defines the font to be used for axis labels. If not provided, then no labels will be rendered. This font object is typically returned from Skia's `useFont` hook.                                                                                                                                                                                                                                                                                                            |
|   **`tickCount`**   | <pre>number &#124; \{<br /> x: number; <br /> y: number;<br />\}</pre>                                                             | Defines the number of ticks to be rendered on both axes, or if provided an object, specific to x and y. If not provided, then the chart will attempt to choose a reasonable number of ticks based on the size of the chart. <br /><br />Note: This is an approximation; the scale may return more or fewer values depending on the domain, padding, and axis labels.                                                                                                         |
|  **`tickValues`**   | <pre>[number] &#124; \{<br /> x: [number]; <br /> y: [number];<br />\}</pre>                                                       | Defines the explicit set of numeric tick values to be rendered on both axes, or if provided an object, specific to x and y. The tickValues prop is used to specify the values of each tick, so we only accept numeric values. Use the `formatXLabel` or `formatYLabel` options to customize how the ticks should be labeled. <br /><br />Note: If `tickCount` value is also provided, it will be used to downsample the provided `tickValues` array to the specified length. |
|   **`lineColor`**   | <pre>string &#124; \{<br /> grid: string &#124; \{<br /> x: string;<br /> y: string;<br /> \};<br /> frame: string;<br />\}</pre>  | Defines the color of the grid and axis lines. It can either apply to both or be customized to each. It will default to `black` if none is provided.                                                                                                                                                                                                                                                                                                                          |
|   **`lineWidth`**   | <pre>number &#124; \{<br /> grid: number &#124; \{<br /> x: number;<br /> y: number;<br /> \}; <br /> frame: number;<br />\}</pre> | Defines the width of the grid and axis lines. It can either apply to both or be customized to each. It will default to `Stylesheet.hairlineWidth` if none is provided. A value of `0` will disable the line rendering.                                                                                                                                                                                                                                                       |
|  **`labelColor`**   | <pre>string &#124; \{<br /> x: string;<br /> y: string;<br />\}</pre>                                                              | Defines the color of the axis labels. It can either apply to both or be customized to each. It will default to `black` if none is provided.                                                                                                                                                                                                                                                                                                                                  |
|  **`labelOffset`**  | <pre>number &#124; \{<br /> x: number;<br /> y: number;<br />\}</pre>                                                              | Defines the offset of the axis labels. It can either apply to both or be customized to each. It will default to `0` if none is provided.                                                                                                                                                                                                                                                                                                                                     |
| **`labelPosition`** | <pre>AxisLabelPosition &#124; \{<br /> x: AxisLabelPosition;<br /> y: AxisLabelPosition;<br />\}</pre>                             | Defines the position of the axis labels. It can either apply to both or be customized to each. It will default to `outset` if none is provided.<br /><br />&#9432; **`AxisLabelPosition`** is an enum with the values: <code>'inset &#124; 'outset'</code>.                                                                                                                                                                                                                  |
|   **`axisSide`**    | <pre>\{<br /> x: XAxisSide;<br /> y: YAxisSide;<br />\}</pre>                                                                      | Defines the side of the chart that the `x` and `y` axis is rendered on. It will default to `left` and `bottom` if none is provided. <br /><br />&#9432; **`XAxisSide`** is an enum with the values: <code>'top' &#124; 'bottom'</code>.<br/>&#9432; **`YAxisSide`** is an enum with the values: <code>'left' &#124; 'right'</code>                                                                                                                                           |
| **`formatXLabel`**  | <pre>(label: T[XK]) => string</pre>                                                                                                | Defines a function provide customization for formatting the x-axis labels. It will default to just returning the value as a string if no function is provided.                                                                                                                                                                                                                                                                                                               |
| **`formatYLabel`**  | <pre>(label: T[YK]) => string</pre>                                                                                                | Defines a function provide customization for formatting the y-axis labels. It will default to just returning the value as a string if no function is provided.                                                                                                                                                                                                                                                                                                               |

### `xAxis`

The `xAxis` is an optional prop allows you to configure the X axis of the chart. If it is not present then the chart will not render any X axis. It is an object of the following properties:

|       Property        | Type                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :-------------------: | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|      **`font`**       | <pre>SkFont &#124; null</pre>       | Defines the font to be used for X axis labels. If not provided, then no labels will be rendered. This font object is typically returned from Skia's `useFont` hook.                                                                                                                                                                                                                                                            |
|    **`tickCount`**    | <pre>number</pre>                   | Defines the number of ticks to be rendered on the X axis. If not provided, then the chart will attempt to choose a reasonable number of ticks based on the size of the chart. <br /><br />Note: This is an approximation; the scale may return more or fewer values depending on the domain, padding, and axis labels.                                                                                                         |
|   **`tickValues`**    | <pre>[number]</pre>                 | Defines the explicit set of numeric tick values to be rendered on the X axis. The tickValues prop is used to specify the values of each tick, so we only accept numeric values. Use the `formatXLabel` or `formatYLabel` options to customize how the ticks should be labeled. <br /><br />Note: If `tickCount` value is also provided, it will be used to downsample the provided `tickValues` array to the specified length. |
|    **`lineColor`**    | <pre>Color (RN Skia Color)</pre>    | Defines the color of the X axis lines. It will default to `hsla(0, 0%, 0%, 0.25)` if none is provided.                                                                                                                                                                                                                                                                                                                         |
|    **`lineWidth`**    | <pre>number</pre>                   | Defines the width of the X axis lines. It will default to `Stylesheet.hairlineWidth` if none is provided. A value of `0` will disable the line rendering.                                                                                                                                                                                                                                                                      |
|   **`labelColor`**    | <pre>string</pre>                   | Defines the color of the X axis label. It will default to `#000000 (black)` if none is provided.                                                                                                                                                                                                                                                                                                                               |
|   **`labelOffset`**   | <pre>number</pre>                   | Defines the offset of the axis label. It will default to `2` if none is provided.                                                                                                                                                                                                                                                                                                                                              |
|  **`labelPosition`**  | <pre>AxisLabelPosition;</pre>       | Defines the position of the x-axis labels. It will default to `outset` if none is provided.<br /><br />&#9432; **`AxisLabelPosition`** is an enum with the values: <code>'inset &#124; 'outset'</code>.                                                                                                                                                                                                                        |
|   **`labelRotate`**   | <pre>number;</pre>                  | Defines the angle of rotation for the X axis labels. It will default to 0. Note: The origin of rotation defaults to the center of the label.                                                                                                                                                                                                                                                                                   |
|    **`axisSide`**     | <pre>XAxisSide</pre>                | Defines the side of the chart that the `X` axis is rendered on. It will default to `bottom` if none is provided. <br /><br />&#9432; **`XAxisSide`** is an enum with the values: <code>'top' &#124; 'bottom'</code>.<br/>                                                                                                                                                                                                      |
|  **`formatXLabel`**   | <pre>(label: T[XK]) => string</pre> | Defines a function provide customization for formatting the X axis labels. It will default to just returning the value as a string if no function is provided.                                                                                                                                                                                                                                                                 |
| **`linePathEffect`**  | <pre>`DashPathEffect`</pre>         | Currently accepts the `<DashPathEffect />` from `react-native-skia` so one can add dashes to their axis lines. In the future this prop may accept other line path effects as well.                                                                                                                                                                                                                                             |
| **`enableRescaling`** | <pre>boolean</pre>                  | When `true`, allows the axis ticks to be rescaled during pan/zoom transformations. When `false`, the ticks will remain fixed at their initial values regardless of zoom level. Defaults to `false`.                                                                                                                                                                                                                            |

### `yAxis`

The `yAxis` is an optional prop allows you to configure the **Y axes** of the chart. If it is not present then the chart will not render any Y-axis. To render multiple Y axes, pass in multiple Y axis objects to the array. It is an array of objects with the following properties:

|        Property         | Type                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :---------------------: | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`yKeys` (optional)**  | <pre>YK[]</pre>                             | A `string[]` array of strings indicating the _keys_ of each `data[number]` object to be used on the dependent (y) axis for charting. Each yAxis object needs to specify which Y data keys it corresponds to. If only one object is passed, then this defaults to the existing yKeys and so remains optional, but you must specify it if you want to have multiple y axes, since the axis must know which data it corresponds to! |
|       **`font`**        | <pre>SkFont &#124; null</pre>               | Defines the font to be used for x axis labels. If not provided, then no labels will be rendered. This font object is typically returned from Skia's `useFont` hook.                                                                                                                                                                                                                                                              |
|     **`tickCount`**     | <pre>number</pre>                           | Defines the number of ticks to be rendered on the Y axis. If not provided, then the chart will attempt to choose a reasonable number of ticks based on the size of the chart. <br /><br />Note: This is an approximation; the scale may return more or fewer values depending on the domain, padding, and axis labels.                                                                                                           |
|    **`tickValues`**     | <pre>[number]</pre>                         | Defines the explicit set of numeric tick values to be rendered on the Y axis. The tickValues prop is used to specify the values of each tick, so we only accept numeric values. Use the `formatXLabel` or `formatYLabel` options to customize how the ticks should be labeled. <br /><br />Note: If `tickCount` value is also provided, it will be used to downsample the provided `tickValues` array to the specified length.   |
|     **`lineColor`**     | <pre>Color (RN Skia Color)</pre>            | Defines the color of the x axis lines. It will default to `hsla(0, 0%, 0%, 0.25)` if none is provided.                                                                                                                                                                                                                                                                                                                           |
|     **`lineWidth`**     | <pre>number</pre>                           | Defines the width of the Y axis lines. It will default to `Stylesheet.hairlineWidth` if none is provided. A value of `0` will disable the line rendering.                                                                                                                                                                                                                                                                        |
|    **`labelColor`**     | <pre>string</pre>                           | Defines the color of the Y axis label. It will default to `#000000 (black)` if none is provided.                                                                                                                                                                                                                                                                                                                                 |
|    **`labelOffset`**    | <pre>number</pre>                           | Defines the offset of the axis label. It will default to `4` if none is provided.                                                                                                                                                                                                                                                                                                                                                |
|   **`labelPosition`**   | <pre>AxisLabelPosition;</pre>               | Defines the position of the Y-axis labels. It will default to `outset` if none is provided.<br /><br />&#9432; **`AxisLabelPosition`** is an enum with the values: <code>'inset &#124; 'outset'</code>.                                                                                                                                                                                                                          |
|     **`axisSide`**      | <pre>YAxisSide</pre>                        | Defines the side of the chart that the `Y` axis is rendered on. It will default to `left` if none is provided. <br /><br />&#9432; **`YAxisSide`** is an enum with the values: <code>'left' &#124; 'right'</code>.<br/>                                                                                                                                                                                                          |
|   **`formatYLabel`**    | <pre>(label: T[YK]) => string</pre>         | Defines a function provide customization for formatting the Y-axis labels. It will default to just returning the value as a string if no function is provided.                                                                                                                                                                                                                                                                   |
| **`domain` (optional)** | <pre>[number] &#124; [number, number]</pre> | Defines the domain for the Y-axis that can be specified to control the upper and lower bounds of the Y-axis. It defaults to the min and max of the range.                                                                                                                                                                                                                                                                        |
|  **`linePathEffect`**   | <pre>`DashPathEffect`</pre>                 | Currently accepts the `<DashPathEffect />` from `react-native-skia` so one can add dashes to their axis lines. In the future this prop may accept other line path effects as well.                                                                                                                                                                                                                                               |
|  **`enableRescaling`**  | <pre>boolean</pre>                          | When `true`, allows the axis ticks to be rescaled during pan/zoom transformations. When `false`, the ticks will remain fixed at their initial values regardless of zoom level. Defaults to `false`.                                                                                                                                                                                                                              |

### `frame`

The `frame` is an optional prop allows you to configure the frame of the chart. If it is not present then the chart will not render any frame. It is an object with the following properties:

|       Property       | Type                                                                                  | Description                                                                                                                                                                 |
| :------------------: | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   **`lineColor`**    | <pre>Color (RN Skia Color)</pre>                                                      | Defines the color of the frame. It will default to `hsla(0, 0%, 0%, 0.25)` if none is provided.                                                                             |
|   **`lineWidth`**    | <pre>number &#124; \{top: number; bottom: number; left: number; right: number\}</pre> | Defines the width of the frame. It will default to `Stylesheet.hairlineWidth` if none is provided. A value of `0` will disable the line rendering.                          |
| **`linePathEffect`** | <pre>`DashPathEffect`</pre>                                                           | Currently accepts the `<DashPathEffect />` from `react-native-skia` so one can add dashes to the frame. In the future this prop may accept other line path effects as well. |

### `chartPressState`

The `chartPressState` prop allows you to pass in Reanimated `SharedValue`s that will be used to track the user's "press" gesture on the chart. This is generally used for creating some sort of tooltip/active value indicator. See the [Chart Gestures page](./chart-gestures.mdx) for more in-depth information on how to use this prop.

The `chartPressState` prop has a type of `ChartPressState | ChartPressState[]`, where `ChartPressState` is an object generated from the `useChartPressState` hook.

:::info
If you have a data point whose y-value is `null` or `undefined`, when that point is "active" the gesture state will return `NaN` for the y-value and y-position.
:::

### `renderOutside`

The `renderOutside` prop is identical to [the `children` prop](#children-required) in form, but it will render elements at the root of the Skia canvas (not inside of a clipping group). This allows you to render elements outside of the bounds of any axes that you have configured.

<div style={{textAlign: 'center'}}>

![Diagram of where renderOutside renders to](../assets/renderOutside.jpg)

</div>

### `onChartBoundsChange`

The `onChartBoundsChange` prop is a function of the shape `onChartBoundsChange?: (bounds: ChartBounds) => void;` that exposes the chart bounds, useful if you need access to the chart's bounds for your own custom drawing purposes.

### `gestureLongPressDelay` <i>deprecated</i>

:::warning
While the `gestureLongPressDelay` prop is still supported, it is deprecated in favor `chartPressConfig` prop. The `gestureLongPressDelay` prop may be removed in a future release.
:::

The `gestureLongPressDelay` prop allows you to set the delay in milliseconds before the pan gesture is activated. Defaults to `100`.

### `chartPressConfig`

The `chartPressConfig` prop allows you to configure the pan gesture handler used for chart interactions. It accepts an object with the following optional properties:

- `activateAfterLongPress`: Configuration for when the gesture should activate after a long press
- `activeOffsetX`: The minimum horizontal pan distance required before the gesture activates
- `activeOffsetY`: The minimum vertical pan distance required before the gesture activates
- `failOffsetX`: The maximum allowed horizontal pan distance before the gesture fails
- `failOffsetY`: The maximum allowed vertical pan distance before the gesture fails

These properties correspond directly to the [React Native Gesture Handler's PanGesture configuration options](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/pan-gesture#configuration).

### `transformState`

The `transformState` prop allows you to pass in a transform state object that enables pan and zoom interactions with the chart. This object is typically created using the `useChartTransformState` hook. When provided, users can:

- Pinch to zoom in/out of the chart
- Pan around the zoomed chart view
- Double tap to reset the zoom level

Example usage:

```tsx
import { CartesianChart, useChartTransformState } from "victory-native";

function MyChart() {
  const { state: transformState } = useChartTransformState();

  return (
    <CartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      transformState={transformState} // 👈 enable pan/zoom
    >
      {/* ... */}
    </CartesianChart>
  );
}
```

### `transformConfig`

An optional configuration object for customizing transform behavior when `transformState` is provided. It accepts the following properties:

```typescript
{
  pan?: {
    enabled?: boolean; // Enable/disable panning gesture (defaults to true)
    dimensions?: "x" | "y" | ("x" | "y")[]; // Control which dimensions can be panned
    activateAfterLongPress?: number; // Minimum time to press before pan gesture is activated
  },
  pinch?: {
    enabled?: boolean; // Enable/disable pinch gesture (defaults to true)
    dimensions?: "x" | "y" | ("x" | "y")[]; // Control which dimensions can be zoomed
  }
}
```

For example, to restrict panning and zooming to only the x-axis:

```typescript
<CartesianChart
  transformState={transformState}
  transformConfig={{
    pan: { dimensions: "x" },
    pinch: { dimensions: "x" }
  }}
  // ... other props
/>
```

### `customGestures`

The `customGestures` prop allows you to provide custom gesture handlers that will work alongside (or instead of) the default chart press gestures. It accepts a `ComposedGesture` from react-native-gesture-handler.

When both `customGestures` and `chartPressState` are provided, the gestures will be composed using `Gesture.Race()`, allowing either gesture to be active.

```ts
const tapGesture = Gesture.Tap().onStart((e) => {
  state.isActive.value = true;
  ref.current?.handleTouch(state, e.x, e.y);
});

const composed = Gesture.Race(tapGesture);
```

### `actionsRef` <i>deprecated</i>

:::warning
Deprecated in favor of the `ref` prop. Use `ref.actions` to access the same functionality.
:::

The `actionsRef` prop allows you to get programmatic access to certain chart actions. It accepts a ref object that will be populated with methods to control chart behavior. Currently supported actions:

- `handleTouch`: Programmatically trigger the chart's touch handling behavior at specific coordinates. This is useful for programmatically highlighting specific data points.

Example usage:

```tsx
function MyChart() {
  const { state } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const actionsRef = useRef<CartesianActionsHandle<typeof state>>(null);

  const highlightPoint = () => {
    // Programmatically highlight a point at coordinates (100, 200)
    actionsRef.current?.handleTouch(state, 100, 200);
  };

  return (
    <CartesianChart
      actionsRef={actionsRef}
      // ... other props
    />
  );
}
```

### `ref`

The `ref` prop provides access to the chart's canvas and actions through a ref object. It exposes both the underlying Skia canvas and chart control methods. Currently exposes:

- `canvas`: Access to the underlying Skia canvas instance, allowing direct canvas operations like `redraw()`, `makeImageSnapshot()`, and `makeImageSnapshotAsync()`
- `actions`: Same actions as `actionsRef`, providing methods to control chart behavior programmatically

:::note React version compatibility
The `ref` prop on `CartesianChart` requires React 19 or newer, which supports passing a `ref` as a regular prop to function components. If you're on React 18 or earlier, use the deprecated `actionsRef` prop for programmatic interactions. Canvas access via `ref.canvas` is not available without React 19.
:::

Example usage:

```tsx
function MyChart() {
  const { state } = useChartPressState({ x: 0, y: { sales: 0 } });
  const chartRef = useRef<CartesianChartRef<typeof state>>(null);

  const handleSnapshot = async () => {
    if (chartRef.current?.canvas) {
      // Take a snapshot of the chart
      const snapshot = await chartRef.current.canvas.makeImageSnapshot();
      const base64 = snapshot.encodeToBase64(ImageFormat.PNG, 100);
      // const imgUri = `data:image/png;base64,${base64}`
      // Use the snapshot...
    }
  };

  const simulateTouch = () => {
    // Use actions to trigger touch programmatically
    chartRef.current?.actions.handleTouch(state, 100, 200);
  };

  return (
    <CartesianChart
      ref={chartRef}
      // ... other props
    />
  );
}
```

### `onScaleChange`

A callback function that is called whenever the chart's scales change, either due to data updates or zoom/pan transformations. The function receives two parameters:

- `xScale`: The current x-axis scale (a d3 linear scale)
- `yScale`: The current y-axis scale (a d3 linear scale)

This is useful for tracking scale changes and accessing the current domain/range of the chart, especially during zoom and pan interactions.

```tsx
<CartesianChart
  onScaleChange={(xScale, yScale) => {
    console.log("X domain:", xScale.domain());
    console.log("Y domain:", yScale.domain());
  }}
  // ... other props
/>
```

### `gestureHandlerConfig`

The `gestureHandlerConfig` prop allows you to configure the underlying [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/gesture-detector#properties) instance. This is useful for fine-tuning gesture interactions, such as enabling/disabling context menus or adjusting touch behavior on web platforms.

It accepts an object of type [`GestureHandlerConfig`](pathname:///../types.ts?symbol=GestureHandlerConfig) with the following optional properties:

- `userSelect`: Controls text selection behavior during gestures (primarily web).
- `enableContextMenu`: Determines if the context menu should appear on long press (primarily web).
- `touchAction`: Manages touch behavior, like preventing scrolling during gestures (primarily web).

Example usage:

```tsx
import { CartesianChart } from "victory-native";

function MyChart() {
  return (
    <CartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      gestureHandlerConfig={{
        enableContextMenu: false, // Disable context menu on long press
        touchAction: "none", // Prevent browser default touch actions
      }}
    >
      {/* ... */}
    </CartesianChart>
  );
}
```

## Render Function Fields

The `CartesianChart` `children` and `renderOutside` render functions both have a single argument that is an object with the following fields.

### `points`

An object of the form `Record<YKey, PointsArray>` where `YKey` is the type of the `yKeys` argument to the `CartesianChart` component and `PointsArray` is of the following shape:

```ts
type PointsArray = {
  x: number;
  xValue: number;
  y: number;
  yValue: number;
}[];
```

This object exposes the raw data in a transformed form for drawing on the Skia canvas.

As an example, if you pass `yKeys={["highTmp"]}` to a `<CartesianChart />` element, then `points.highTmp` will give you an array of points to either use directly for drawing purposes, or to pass to an e.g. [`Line`](./line/line.md) or [`Bar`](./bar/bar.md) component.

:::tip
The points object is technically a Proxy of an empty object. When you try to log the entire points object directly, you won't see the computed results because the underlying target object is always empty. Instead, you need to log the specific key you're interested in. This is because the Proxy's get trap intercepts the property access, dynamically computing and caching the results only for accessed keys.

```tsx
console.log(points); // always {}
console.log(points[YKey]); // [{ x: 0, xValue: 0, y: 0, yValue: 0 }, ...] etc
```

:::

### `canvasSize`

An object of the shape `{ width: number; height: number; }` that represents the overall size of the Skia canvas that the chart renders on.

### `chartBounds`

An object of the shape `{ left: number; right: number; bottom: number; top: number; }` that represents the Skia coordinates of the bounding box for the "drawing area" of the chart (that is, the area that sits inside of the chart's axes).

### `xScale`

A [`d3-scale` linear scale](https://d3js.org/d3-scale/linear) used for mapping the raw data's independent variable onto the canvas's horizontal axis.

### `yScale`

A [`d3-scale` linear scale](https://d3js.org/d3-scale/linear) used for mapping the raw data's dependent variables onto the canvas's vertical axis.

### `xTicks`

a `number[]` which holds the normalized values of the canvas's horizontal axis. To map into canvas position values, use `xScale` (i.e. `xScale(xTicks[0])`)

### `yTicks`

a `number[]` which holds the normalized values of the canvas's vertical axis. To map into canvas position values, use `yScale` (i.e. `yScale(yTicks[0])`)
