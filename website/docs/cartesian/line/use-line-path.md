# `useLinePath`

The `useLinePath` hook takes a `PointsArray` input, as well as some options, and returns a Skia `SkPath` path object that represents the path for that line chart.

## Example

```tsx
import { CartesianChart, useLinePath, type PointsArray } from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomLine({ points }: { points: PointsArray }) {
  // 👇 use the hook to generate a path object.
  const { path } = useLinePath(points, { curveType: "natural" });
  return <Path path={path} style="stroke" strokeWidth={3} color="red" />;
}

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="x" yKeys={["y"]}>
      {/* 👇 pass a PointsArray to our custom component */}
      {({ points }) => <MyCustomLine points={points.y} />}
    </CartesianChart>
  );
}
```

## Arguments

`useLinePath` has a function signature as follows:

```ts
useLinePath(points: PointsArray, options?: { curveType?: CurveType }): { path: SkPath }
```

### `points`

The `points` argument is a `PointsArray` array used to generate the line's path. Generally, this array comes from a field of the `points` object exposed the `children` render function of `CartesianChart`, as illustrated in the example above.

### `options`

The `options` argument object has the following fields:

- `curveType: CurveType`: the type of curve to use for the path, powered by `d3-shape`. The options are:
  - `linear` (default)
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
