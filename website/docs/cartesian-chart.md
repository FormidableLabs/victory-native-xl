# Cartesian Chart

The `CartesianChart` component is perhaps the core component of `victory-native`. It's core responsibilities are:

- accepting raw data that you'd eventually like to chart, as well as some configuration around charting (such as options for axes, etc.)
- transforming that raw data into a format that can be easily accessed and used for charting with other `victory-native` components.

## Example

The example below shows a basic use of the `CartesianChart`.

```tsx
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";
// 👇 import a font file you'd like to use for tick labels
import inter from "../assets/inter-medium.ttf";

function MyChart() {
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

### `yKeys` (required)

A `string[]` array of string indicating the _keys_ of each `data[number]` object to be used on the dependent (y) axis for charting. E.g. `yKeys={["lowTmp", "highTmp"]}` if you want to chart both high and low temperatures on the y-axis and those values have keys of `lowTmp` and `highTmp` respectively.

### `children` (required)

The `children` prop is a render function whose sole argument is an object that exposes transformed data for you to use in your drawing operations. For example, the `children` render function's argument has a `points` field that exposes a version of your input data that's transformed to be plotted on the Canvas (see [the Example section](#example) above for an example of this).

**See the [Render Function Fields](#render-function-fields) section for an outline of all of the available fields on the render function argument.**

The `children` function will render its Skia elements inside of [a clipping group](https://shopify.github.io/react-native-skia/docs/group/#clipping-operations) that sit inside of the bounds of the charts axes, so that your charting elements do not overflow outside of your axes.

### `padding`

A `number` or an object of shape `{ left?: number; right?: number; top?: number; bottom?: number; }` that specifies that padding between the outer bounds of the Skia canvas and where the charting bounds will occur.

For example, passing `padding={{ left: 20, bottom: 20 }}` will add 20 DIPs of space to the bottom and left of the chart, but have the chart "bleed" to the right and top. Passing `padding={20}` will add 20 DIPs of space to all sides.

### `domainPadding`

A `number` or an object of shape `{ left?: number; right?: number; top?: number; bottom?: number; }` that specifies that padding between the outer bounds of the _charting area_ (e.g. where the axes lie) and where chart elements will be plotted.

For example, passing `padding={{ left: 20, right: 20 }}` will add 20 DIPs of space between the edges of the chart and where the line/bar/area graph will start.

### `gridOptions`

DOCS:TODO:

### `axisOptions`

DOCS:TODO:

### `activePressSharedValue`

The `activePressSharedValue` prop allows you to create Reanimated `SharedValue`s that will be used to track the user's "press" gesture on the chart. This is generally used for creating some sort of tooltip/active value indicator. See the [Basic Tooltip Guide](./guides/basic-tooltip.md) for more in-depth information on how to use this prop.

The `activePressSharedValue` prop has a type of `ChartPressValue | ChartPressValue[]`, where `ChartPressValue` is an object generated from the `useChartPressSharedValue` hook.

### `renderOutside`

The `renderOutside` prop is identical to [the `children` prop](#children-required) in form, but it will render elements at the root of the Skia canvas (not inside of a clipping group). This allows you to render elements outside of the bounds of any axes that you have configured.

DOCS:TODO: Diagram of what this visually looks like.

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

### `canvasSize`

An object of the shape `{ width: number; height: number; }` that represents the overall size of the Skia canvas that the chart renders on.

### `chartBounds`

An object of the shape `{ left: number; right: number; bottom: number; top: number; }` that represents the Skia coordinates of the bounding box for the "drawing area" of the chart (that is, the area that sits inside of the chart's axes).

### `xScale`

A [`d3-scale` linear scale](https://d3js.org/d3-scale/linear) used for mapping the raw data's independent variable onto the canvas's horizontal axis.

### `yScale`

A [`d3-scale` linear scale](https://d3js.org/d3-scale/linear) used for mapping the raw data's dependent variables onto the canvas's vertical axis.
