# `useBarPath`

The `useBarPath` hook takes a `PointsArray` input, a `ChartBounds` object, and an "inner padding" value, and returns a Skia `SkPath` path object that represents the path for that bar chart.

## Example


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
useBarPath(
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding?: number,
  roundedCorners?: RoundedCorners,
  barWidth?: number,
  barCount?: number,
): { path: SkPath; barWidth: number; }
```

### `points`

The `points` argument is a `PointsArray` array used to generate the bars' path. Generally, this array comes from a field of the `points` object exposed the `children` render function of `CartesianChart`, as illustrated in the example above.

### `chartBounds`

A `ChartBounds` object needed to appropriately draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `innerPadding`

An optional `number` between 0 and 1 that represents what fraction of the horizontal space between the first and last bars should be "white space". Defaults to `0.2`. Use `0` for no gap between bars, and values closer to `1` to make bars increasingly narrow.

### `roundedCorners`

An optional `RoundedCorners` object for generating a rounded bar path. Corner radii are capped to half of the rendered bar width.

### `barWidth`

An optional explicit bar width. This takes precedence over `barCount` and the computed width. Explicit `0` is respected.

### `barCount`

An optional count used to compute bar width as if there were `barCount` x data points. This is useful for keeping bar widths stable when rendering dynamic subsets of a larger dataset.

## Returns

Returns an object with the following fields.

### `path`

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element.

### `barWidth`

A `number` representing the width of each bar.

## Related sizing helpers

`useBarWidth` and `getBarWidth` are also exported for custom bar overlays that need to share the built-in bar width calculation without generating a Skia path. `createRoundedRectPath` is exported for custom bars that need the same rounded-corner path geometry as the built-in `Bar`, `BarGroup`, and `StackedBar` components.

```ts
const barWidth = getBarWidth({
  points,
  chartBounds,
  innerPadding: 0.25,
  barCount: maxVisibleBars,
});
```
