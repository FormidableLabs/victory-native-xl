# `useBarGroupPaths`

The `useBarGroupPaths` hook takes an _array_ of `PointsArray`, a `ChartBounds` object, and some padding options, and returns a list of `SkPath` paths and some details about the spacing of the bars.

## Exmaple

```tsx
import {
  CartesianChart,
  useBarGroupPaths,
  type PointsArray,
  type ChartBounds,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomBarGroup({
  points,
  chartBounds,
  innerPadding,
}: {
  points: PointsArray[];
  chartBounds: ChartBounds;
}) {
  // 👇 use the hook to generate path objects.
  const { paths } = useBarGroupPaths(points, chartBounds);

  return paths.map((path) => <Path path={path} style="fill" color="red" />);
}

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="x" yKeys={["y", "z"]}>
      {({ points }) => <MyCustomBarGroup points={[points.y, points.z]} />}
    </CartesianChart>
  );
}
```

## Arguments

`useBarGroupPaths` has a function signature as follows:

```ts
useBarGroupPaths(points: PointsArray[], chartBounds: ChartBounds, betweenGroupPadding?: number, withinGroupPadding?: number ): { paths: SkPath[]; barWidth: number; groupWidth: number; gapWidth: number; }
```

### `points`

The `points` argument is an _array_ of `PointsArray` arrays used to generate the bars' paths. Generally, these arrays comes from a field of the `points` object exposed the `children` render function of `CartesianChart`, as illustrated in the example above.

### `chartBounds`

A `ChartBounds` object needed to appropriately draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `betweenGroupPadding`

An optional `number` between 0 and 1 that represents what fraction of the horizontal space between the first and last bar groups should be "white space". Defaults to `0.2`. Use `0` for no gap between groups, and values closer to `1` to make bars increasingly narrow.

### `withinGroupPadding`

An optional `number` between 0 and 1 that represents what fraction of the horizontal space between the first and last bars _within a group_ should be "white space". Defaults to `0.2`. Use `0` for no gap between bars within a group, and values closer to `1` to make bars increasingly narrow.

## Returns

`useBarGroupPaths` returns an object with the following fields.

### `paths`

An array of `SkPath` path objects to be used as the `path` argument of a Skia `<Path />` element.

### `barWidth`

A `number` representing the width of each bar.

### `groupWidth`

A `number` representing the width of each bar group.

### `gapWidth`

A `number` representing the gap size between each bar in a group.
