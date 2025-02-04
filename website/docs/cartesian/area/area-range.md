# `AreaRange` (Component)

The `AreaRange` component takes a `PointsArray` prop with upper and lower bounds (`y` and `y0`), as well as options for styling/animating, and returns a Skia `Path` element to draw a shaded area between two bounds. This is commonly used for visualizing error bars, confidence intervals, or data ranges around a central line.

## Example

```tsx
import { CartesianChart, AreaRange, Line } from "victory-native";
import DATA from "./my-data";

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="day" yKeys={["middle", "lower", "upper"]}>
      {({ points }) => (
        <>
          {/* Draw shaded area for error bounds */}
          <AreaRange
            points={points.middle.map((p) => ({
              ...p,
              y: p.middle + errorMargin, // Upper bound
              y0: p.middle - errorMargin, // Lower bound
            }))}
            color="rgba(100, 100, 255, 0.2)"
            animate={{ type: "timing" }}
          />
          <AreaRange
            upperPoints={points.upper}
            lowerPoints={points.lower}
            color="rgba(100, 100, 255, 0.2)"
            animate={{ type: "timing" }}
          />
          {/* Draw the main line */}
          <Line
            points={points.middle}
            color="blue"
            strokeWidth={2}
            animate={{ type: "timing" }}
          />
        </>
      )}
    </CartesianChart>
  );
}
```

## Props

### `points`

An `AreaRangePointsArray` array that extends the standard `PointsArray` type but uses:

- `y` to represent the upper bound
- `y0` to represent the lower bound

> Used as an alternative to `upperPoints` and `lowerPoints`

### `upperPoints`

A `PointsArray` array that comes from a field of the `points` object exposed the `children` render function of `CartesianChart`.

> It is used with `lowerPoints` as an alternative to `points`

### `lowerPoints`

A `PointsArray` array that comes from a field of the `points` object exposed the `children` render function of `CartesianChart`.

> It is used with `upperPoints` as an alternative to `points`

### `animate`

The `animate` prop takes [a `PathAnimationConfig` object](../../animated-paths.md#animconfig) and will animate the path when the points change.

### `curveType`

[A `CurveType` value](./use-area-path.md#options) that indicates the type of curve should be drawn (e.g. `linear` or `natural`).

### `connectMissingData`

[The `connectMissingData: boolean` value](./use-area-path.md#options) that indicates whether missing data should be interpolated for the resulting `Path`. If set to `true`, the output will be a single, connected area (even if there are missing data values). If set to `false`, if there is missing data values – the path will consist of multiple disconnected "parts".

### `children`

A `children` pass-thru that will be rendered inside of the Skia `Path` element, useful if you'd like to make e.g. a gradient path.

### Paint properties

The `AreaRange` component will also pass the following [painting props](https://shopify.github.io/react-native-skia/docs/paint/overview) down to the underlying `Path` component:

- `color`
- `blendMode`
- `opacity`
- `antiAlias`
