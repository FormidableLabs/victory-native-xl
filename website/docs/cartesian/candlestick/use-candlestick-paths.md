# `useCandlestickPaths`

`useCandlestickPaths` builds Skia paths for candlestick bodies and wicks from
four `PointsArray` values. The `Candlestick` component uses this hook
internally, but the hook is exported for custom mark composition.

## Example

```tsx
import * as React from "react";
import {
  CartesianChart,
  useCandlestickPaths,
  type PointsArray,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";

function CustomCandles({
  openPoints,
  highPoints,
  lowPoints,
  closePoints,
  chartBounds,
}) {
  const paths = useCandlestickPaths({
    openPoints,
    highPoints,
    lowPoints,
    closePoints,
    chartBounds,
    candleRatio: 0.5,
    wickStrokeWidth: 2,
  });

  if (paths.mode === "custom") {
    return null;
  }

  return (
    <>
      {paths.groups.map((group) => (
        <React.Fragment key={group.key}>
          <Path
            path={group.wickPath}
            style="stroke"
            {...group.wickOptions}
          />
          <Path path={group.bodyPath} style="fill" {...group.bodyOptions} />
        </React.Fragment>
      ))}
    </>
  );
}

export function MyChart() {
  return (
    <CartesianChart
      data={DATA}
      xKey="date"
      yKeys={["open", "high", "low", "close"]}
    >
      {({ points, chartBounds }) => (
        <CustomCandles
          openPoints={points.open}
          highPoints={points.high}
          lowPoints={points.low}
          closePoints={points.close}
          chartBounds={chartBounds}
        />
      )}
    </CartesianChart>
  );
}
```

## Arguments

```ts
useCandlestickPaths({
  openPoints: PointsArray;
  highPoints: PointsArray;
  lowPoints: PointsArray;
  closePoints: PointsArray;
  chartBounds: ChartBounds;
  candleWidth?: number;
  candleRatio?: number;
  candleCount?: number;
  minBodyHeight?: number;
  candleColors?: {
    positive?: Color;
    negative?: Color;
    neutral?: Color;
  };
  wickStrokeWidth?: number;
  candleOptions?: (context: CandlestickOptionsContext) => CandlestickOptions;
});
```

### `openPoints`, `highPoints`, `lowPoints`, `closePoints`

The transformed OHLC points from the `CartesianChart` render function.

### `chartBounds`

The chart bounds from the `CartesianChart` render function. This is used to
compute automatic candle width.

### `candleWidth`, `candleRatio`, `candleCount`

Width controls. `candleWidth` wins when supplied. Otherwise the hook uses the
same width contract as bar marks, with `candleRatio` controlling how much of the
available x spacing is used and `candleCount` optionally stabilizing widths for
dynamic windows.

### `minBodyHeight`

Minimum candle body height in canvas pixels. This keeps neutral and very small
body candles visible.

### `candleColors`

Status colors for positive, negative, and neutral candles.

### `wickStrokeWidth`

Default stroke width for wick paths.

### `candleOptions`

When omitted, the hook returns batched grouped paths by status. When supplied,
the hook returns one body path and one wick path per candle with the callback's
style options applied.

## Returns

The hook returns a discriminated union.

### Grouped mode

```ts
{
  mode: "grouped";
  candleWidth: number;
  geometry: CandlestickGeometry[];
  groups: CandlestickPathGroup[];
}
```

Grouped mode is the default. It batches all positive, negative, and neutral
candles into status-based body and wick paths.

### Custom mode

```ts
{
  mode: "custom";
  candleWidth: number;
  geometry: CandlestickGeometry[];
  candles: CustomCandlestickPath[];
}
```

Custom mode is enabled by `candleOptions` and returns per-candle body and wick
paths.

## Geometry

Each `CandlestickGeometry` entry contains the raw OHLC values, transformed y
positions, body rectangle, wick line, status, x position, raw x value, and datum
index. This is useful for overlays, labels, custom hit testing, and fully custom
rendering.
