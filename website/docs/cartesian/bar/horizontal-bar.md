# `HorizontalBar` (Component)

The `HorizontalBar` component draws a single-series horizontal bar chart inside a `CartesianChart` with `orientation="horizontal"`.

Horizontal bar charts keep the usual Victory Native data shape: `xKey` identifies the category field, and `yKeys` identify numeric value fields. In horizontal mode, categories render on the vertical axis and values render on the horizontal axis.

## Example

```tsx
import { CartesianChart, HorizontalBar } from "victory-native";

const DATA = [
  { category: "Audio", revenue: 42 },
  { category: "Books", revenue: -8 },
  { category: "Events", revenue: 96 },
];

export function MyChart() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["revenue"]}
      domain={{ x: [-20, 120] }}
      domainPadding={{ top: 24, bottom: 24, right: 24 }}
      xAxis={{ tickCount: 5 }}
      yAxis={[{ yKeys: ["revenue"] }]}
    >
      {({ points, chartBounds }) => (
        <HorizontalBar
          points={points.revenue}
          chartBounds={chartBounds}
          color="teal"
          roundedCorners={{ topRight: 8, bottomRight: 8 }}
        />
      )}
    </CartesianChart>
  );
}
```

## Props

`HorizontalBar` mirrors the `Bar` component API:

- `points`: a `PointsArray` from the `CartesianChart` render function.
- `chartBounds`: the `chartBounds` render argument from `CartesianChart`.
- `innerPadding`: controls the vertical space between bars when `barWidth` is not set.
- `animate`: path animation config.
- `roundedCorners`: corner radii for each bar.
- `barWidth`: fixed visual bar thickness.
- `barCount`: computes thickness as if there were a fixed number of bars.
- `labels`: value labels using the same `{ position, font, color }` shape as `Bar`.

## Horizontal Mode Notes

- `domain.x`, `viewport.x`, and `domainPadding.left/right` apply to the numeric value axis.
- `domainPadding.top/bottom` apply to category spacing.
- The zero baseline is used for positive and negative values.
- `points[key].x` is the value endpoint on screen.
- `points[key].y` is the category center on screen.
- `points[key].xValue` remains the raw category value.
- `points[key].yValue` remains the raw numeric value.

Grouped and stacked horizontal bars are not part of the initial component. Use `BarGroup` and `StackedBar` for vertical grouped and stacked bars.
