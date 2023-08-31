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

### `data`

An array of objects to be used as data points for the chart.

### `xKey`

A `string` value indicating the _key_ of each `data[number]` object to be used on the independent (x) axis for charting. E.g. `"day"` if you want to use the `"day"` field of the data points for the x-axis.

### `yKeys`

A `string[]` array of string indicating the _keys_ of each `data[number]` object to be used on the dependent (y) axis for charting. E.g. `yKeys={["lowTmp", "highTmp"]}` if you want to chart both high and low temperatures on the y-axis and those values have keys of `lowTmp` and `highTmp` respectively.

### `padding`

A `number` or an object of shape `{ left?: number; right?: number; top?: number; bottom?: number; }` that specifies that padding between the outer bounds of the Skia canvas and where the charting bounds will occur.

For example, passing `padding={{ left: 20, bottom: 20 }}` will add 20 DIPs of space to the bottoma and left of the chart, but have the chart "bleed" to the right and top.

### `domainPadding`

DOCS:TODO:

## Render Function Arguments

DOCS:TODO:
