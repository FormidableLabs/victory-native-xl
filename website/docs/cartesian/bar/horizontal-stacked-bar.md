# `HorizontalStackedBar` (Component)

The `HorizontalStackedBar` component draws stacked horizontal bars inside a `CartesianChart` with `orientation="horizontal"`.

Horizontal stacked bars use the same data shape as vertical stacked bars: `xKey` identifies the category field, and `yKeys` identify the numeric value fields to stack. In horizontal mode, categories render on the vertical axis and stacked values render on the horizontal axis.

## Example

```tsx
import { CartesianChart, HorizontalStackedBar } from "victory-native";

const DATA = [
  { category: "North", product: 72, services: 44, support: 28 },
  { category: "West", product: 58, services: 62, support: 34 },
  { category: "South", product: 41, services: 38, support: 46 },
  { category: "East", product: 67, services: 52, support: 31 },
];

export function MyChart() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["product", "services", "support"]}
      domain={{ x: [0, 170] }}
      domainPadding={{ top: 36, bottom: 36, right: 24 }}
      xAxis={{ tickCount: 5 }}
      yAxis={[{ yKeys: ["product", "services", "support"] }]}
    >
      {({ points, chartBounds }) => (
        <HorizontalStackedBar
          points={[points.product, points.services, points.support]}
          chartBounds={chartBounds}
          colors={["teal", "purple", "orange"]}
          barOptions={({ isEnd }) => ({
            roundedCorners: isEnd
              ? { topRight: 8, bottomRight: 8 }
              : undefined,
          })}
        />
      )}
    </CartesianChart>
  );
}
```

## Props

- `points`: an array of `PointsArray` values from the `CartesianChart` render function. The order should match the intended stack order.
- `chartBounds`: the `chartBounds` render argument from `CartesianChart`.
- `innerPadding`: controls the vertical space between stacked bars when `barWidth` is not set.
- `animate`: path animation config.
- `barWidth`: fixed visual bar thickness.
- `barCount`: computes thickness as if there were a fixed number of bars.
- `colors`: segment colors. The order should match the `points` prop.
- `barOptions`: render options for each stack segment.

## `useHorizontalStackedBarPaths`

`HorizontalStackedBar` is built on top of the exported `useHorizontalStackedBarPaths` hook. Use the hook directly when you need custom Skia rendering but want the built-in horizontal stacking geometry:

```tsx
const paths = useHorizontalStackedBarPaths({
  points: [points.product, points.services, points.support],
  chartBounds,
  innerPadding: 0.25,
  barWidth: 24,
  colors: ["teal", "purple", "orange"],
  barOptions: ({ isEnd }) => ({
    roundedCorners: isEnd ? { topRight: 8, bottomRight: 8 } : undefined,
  }),
});
```

The hook returns `HorizontalStackedBarPath[]`, where each entry contains the Skia `path`, a stable `key`, optional `color`, paint props, and optional `children`.

## `barOptions`

```tsx
barOptions?: ({
  columnIndex,
  rowIndex,
  isStart,
  isEnd,
  isLeft,
  isRight,
  seriesIndex,
  datumIndex,
}: {
  columnIndex: number;
  rowIndex: number;
  isStart: boolean;
  isEnd: boolean;
  isLeft: boolean;
  isRight: boolean;
  seriesIndex: number;
  datumIndex: number;
}) => CustomizablePathProps & {
  roundedCorners?: RoundedCorners;
  children?: React.ReactNode;
};
```

`seriesIndex` and `datumIndex` identify the rendered series and datum. `columnIndex` and `rowIndex` are backwards-compatible aliases for the same values. `isStart` identifies the segment closest to the zero baseline for that positive or negative stack, and `isEnd` identifies the outer visible value end. `isLeft` and `isRight` are screen-side aliases derived from those neutral fields.

For value-end rounding, use `isEnd` with right-side corners. Negative horizontal segments automatically flip right-side corner radii to the left side:

```tsx
barOptions={({ isEnd }) => ({
  roundedCorners: isEnd ? { topRight: 8, bottomRight: 8 } : undefined,
})}
```

## Horizontal Mode Notes

- `domain.x`, `viewport.x`, and `domainPadding.left/right` apply to the numeric value axis.
- `domainPadding.top/bottom` apply to category spacing.
- Positive stacks accumulate to the right from `xScale(0)`.
- Negative stacks accumulate to the left from `xScale(0)`.
- Missing values are skipped.
- Zero values render as zero-width segments.
- `points[key].x` is the individual value endpoint on screen.
- `points[key].y` is the category center on screen.
- `points[key].xValue` remains the raw category value.
- `points[key].yValue` remains the raw numeric value.
- `HorizontalStackedBar` is only supported inside `CartesianChart orientation="horizontal"`.

As with vertical `StackedBar`, set an explicit value domain when the cumulative stack total exceeds the largest individual series value.

When using `chartPressState`, `state.yIndex.value` identifies the touched stack segment by `seriesIndex` for the selected category. Positive and negative stacks are matched independently from the zero baseline.

The example app includes horizontal stacked examples for mixed positive/negative values, pressable segment highlighting, custom Skia children, and missing or zero-valued segments.
