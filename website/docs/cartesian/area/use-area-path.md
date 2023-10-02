# `useAreaPath`

The `useAreaPath` hook takes a `PointsArray` input, a value for the "bottom" of the area chart, and some options, and returns a Skia `SkPath` path object that represents the path for that line chart.

## Exmaple

```tsx
import { CartesianChart, useAreaPath, type PointsArray } from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomArea({
  points,
  bottom,
}: {
  points: PointsArray;
  bottom: number;
}) {
  // 👇 use the hook to generate a path object.
  const { path } = useAreaPath(points, bottom, { curveType: "natural" });
  return <Path path={path} style="fill" color="red" />;
}

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="x" yKeys={["y"]}>
      {/* 👇 pass a PointsArray to our custom component */}
      {({ points, chartBounds }) => (
        <MyCustomArea points={points.y} bottom={chartBounds.bottom} />
      )}
    </CartesianChart>
  );
}
```

:::info
The `useAreaPath` requires the `y0` argument to know how to "close" the area. Generally, you'll want to pass it `chartBounds.bottom` from the chart's render argument.
:::

## Arguments

`useAreaPath` has a function signature as follows:

```ts
useAreaPath(points: PointsArray, y0: number, options?: { curveType?: CurveType }): { path: SkPath }
```

### `points`

The `points` argument is a `PointsArray` array used to generate the line's path. Generally, this array comes from a field of the `points` object exposed the `children` render function of `CartesianChart`, as illustrated in the example above.

### `y0`

A `number` that indicates where the "bottom" of the area path should run. This number should be in _canvas coordinates_.

### `options`

The `options` argument object has the following fields:

- `curveType: CurveType`: the type of curve to use for the path, powered by `d3-shape`. The options are:
  - `linear`
  - `natural`
  - `bumpX`
  - `bumpY`
  - `cardinal`
  - `cardinal50`
  - `catmullRom`
  - `catmullRom0`
  - `catmullRom100`
  - `step`
- `connectMissingData: boolean`: whether or not to interpolate missing data for this path (default is `false`). If set to `true`, the output will be a single, connected path (even if there are missing data values).

## Returns

### `path`

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element.
