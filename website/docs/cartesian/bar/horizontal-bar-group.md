# `HorizontalBarGroup` (Component)

The `HorizontalBarGroup` component draws grouped horizontal bars inside a `CartesianChart` with `orientation="horizontal"`.

Use it when each category has multiple numeric series that should render as separate bars within the same category row. Categories still come from `xKey`, and numeric values still come from `yKeys`.

## Example

```tsx
import { CartesianChart, HorizontalBarGroup } from "victory-native";

const DATA = [
  { category: "North", product: 72, services: 44 },
  { category: "West", product: 58, services: 62 },
  { category: "South", product: 41, services: 38 },
];

export function MyChart() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["product", "services"]}
      domain={{ x: [0, 100] }}
      domainPadding={{ top: 32, bottom: 32, right: 24 }}
      xAxis={{ tickCount: 5 }}
      yAxis={[{ yKeys: ["product", "services"] }]}
    >
      {({ points, chartBounds }) => (
        <HorizontalBarGroup
          chartBounds={chartBounds}
          betweenGroupPadding={0.35}
          withinGroupPadding={0.2}
          roundedCorners={{ topRight: 6, bottomRight: 6 }}
        >
          <HorizontalBarGroup.Bar points={points.product} color="teal" />
          <HorizontalBarGroup.Bar points={points.services} color="purple" />
        </HorizontalBarGroup>
      )}
    </CartesianChart>
  );
}
```

## Props

### `chartBounds`

A `ChartBounds` object needed to draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `betweenGroupPadding`

An optional `number` between 0 and 1 that controls vertical space between category groups. Defaults to `0.25`.

### `withinGroupPadding`

An optional `number` between 0 and 1 that controls vertical space between bars within each category group. Defaults to `0.25`.

### `barWidth`

Sets the visual thickness of each horizontal bar. Explicit `barWidth={0}` is respected. If omitted, thickness is computed from the chart's vertical category range, the number of groups, the number of bars per group, and padding.

### `barCount`

Computes group sizing as if there were `barCount` category groups. This is useful for keeping grouped bar thickness stable when the visible data window changes.

### `onBarSizeChange`

An optional callback of the form:

```ts
onBarSizeChange: (values: {
  barWidth: number;
  groupWidth: number;
  gapWidth: number;
}) => void;
```

For horizontal grouped bars, `barWidth` is visual bar thickness, `groupWidth` is visual group height, and `gapWidth` is the vertical gap between bars inside a category group.

### `roundedCorners`

Corner radii for each grouped bar. For negative horizontal values, left and right corner semantics are flipped so value-end rounding stays on the visible value end.

### `children`

`HorizontalBarGroup.Bar` children that represent each series in the group.

## `HorizontalBarGroup.Bar` Props

### `points`

A `PointsArray` for the series. This generally comes from the `points` render argument of `CartesianChart`.

### `animate`

The `animate` prop takes [a `PathAnimationConfig` object](../../animated-paths.md#animconfig) and animates the path when points change.

### `children`

Children are rendered inside the Skia `Path`, which is useful for gradients.

### Paint Properties

The component passes the following paint props to the underlying Skia `Path`:

- `color`
- `blendMode`
- `opacity`
- `antiAlias`

## Horizontal Mode Notes

- `HorizontalBarGroup` is only supported inside `CartesianChart orientation="horizontal"`.
- Each category group is centered on `points[key].y`.
- Bars within a category group are offset along the vertical screen axis.
- Positive values extend right from zero.
- Negative values extend left from zero.
- For stacked horizontal bars, use [`HorizontalStackedBar`](./horizontal-stacked-bar.md).

When using `chartPressState`, horizontal grouped bars use the same data-semantic press values documented in [`HorizontalBar`](./horizontal-bar.md). The example app's horizontal grouped route includes an active-row tooltip readout built from `state.x` and the grouped series values.
