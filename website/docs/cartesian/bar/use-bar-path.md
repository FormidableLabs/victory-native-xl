# `useBarPath`

The `useBarPath` hook takes a `PointsArray` input, a `ChartBounds` object, and an "inner padding" value, and returns a Skia `SkPath` path object that represents the path for that bar chart.

## Exmaple

```tsx
import {
  CartesianChart,
  useBarPath,
  type PointsArray,
  type ChartBounds,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomBars({
  points,
  chartBounds,
  innerPadding,
}: {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
}) {
  // 👇 use the hook to generate a path object.
  const { path } = useBarPath(points, chartBounds, innerPadding);
  return <Path path={path} style="fill" color="red" />;
}

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="x" yKeys={["y"]}>
      {/* 👇 pass a PointsArray to our custom component */}
      {({ points, chartBounds }) => <MyCustomBars points={points.y} chartBounds={chartBounds} />}
    </CartesianChart>
  );
}
```

## Arguments

`useBarPath` has a function signature as follows:

```ts
useBarPath(points: PointsArray, chartBounds: ChartBounds, innerPadding?: number): { path: SkPath; barWidth: number; }
```

### `points`

The `points` argument is a `PointsArray` array used to generate the bars' path. Generally, this array comes from a field of the `points` object exposed the `children` render function of `CartesianChart`, as illustrated in the example above.

### `chartBounds`

A `ChartBounds` object needed to appropriately draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `innerPadding`

An optional `number` between 0 and 1 that represents what fraction of the horizontal space between the first and last bars should be "white space". Defaults to `0.2`. Use `0` for no gap between bars, and values closer to `1` to make bars increasingly narrow.

### `dataLength`

An optional `dataLength` prop allows you to set the desired data length when calculating bar width.

This overrides the default calculation of `points.length`. Usually used when rendering a static `x` domain and you want the bar widths to be the same across multiple graphs with various amounts of missing data.

## Returns

Returns an object with the following fields.

### `path`

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element.

### `barWidth`

A `number` representing the width of each bar.
