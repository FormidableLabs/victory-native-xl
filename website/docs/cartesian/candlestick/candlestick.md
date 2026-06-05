# `Candlestick` (Component)

The `Candlestick` component draws open, high, low, and close values inside a
`CartesianChart`. It is commonly used for financial time-series charts where
each x value represents a time period.

## Example

```tsx
import { Candlestick, CartesianChart, useChartPressState } from "victory-native";

export function MyChart() {
  const press = useChartPressState({
    x: DATA[0].date,
    y: { open: 0, high: 0, low: 0, close: 0 },
  });

  return (
    <CartesianChart
      data={DATA}
      xKey="date"
      yKeys={["open", "high", "low", "close"]}
      chartPressState={press.state}
      xAxis={{
        formatXLabel: (ms) => new Date(ms).toLocaleDateString(),
      }}
      yAxis={[
        {
          yKeys: ["open", "high", "low", "close"],
          formatYLabel: (value) => `$${Number(value).toFixed(0)}`,
        },
      ]}
    >
      {({ points, chartBounds }) => (
        <Candlestick
          openPoints={points.open}
          highPoints={points.high}
          lowPoints={points.low}
          closePoints={points.close}
          chartBounds={chartBounds}
          candleColors={{
            positive: "#16a34a",
            negative: "#dc2626",
            neutral: "#71717a",
          }}
        />
      )}
    </CartesianChart>
  );
}
```

## Props

### `openPoints`, `highPoints`, `lowPoints`, `closePoints`

`PointsArray` values from the `CartesianChart` render function. The parent chart
must include all four fields in `yKeys` so the y-domain accounts for the full
OHLC range.

### `chartBounds`

The `chartBounds` render argument from `CartesianChart`. This is used to compute
automatic candle width.

### `candleColors`

An object for status-based colors:

```ts
{
  positive?: Color;
  negative?: Color;
  neutral?: Color;
}
```

`positive` candles close above open, `negative` candles close below open, and
`neutral` candles have equal open and close values.

### `candleRatio`

A number from `0` to `1` that controls how much of the available x spacing each
candle body uses. Defaults to `0.6`.

### `candleWidth`

An explicit candle body width in canvas pixels. This takes precedence over
`candleRatio`.

### `candleCount`

An optional count used to compute candle width as if there were `candleCount`
x values. This is useful when rendering a moving window of a larger data set.

### `minBodyHeight`

The minimum body height in canvas pixels. Defaults to `1`, which keeps doji
candles visible.

### `wickStrokeWidth`

The stroke width for high-low wicks. Defaults to `1`.

### `candleOptions`

A callback for per-candle styling:

```tsx
<Candlestick
  openPoints={points.open}
  highPoints={points.high}
  lowPoints={points.low}
  closePoints={points.close}
  chartBounds={chartBounds}
  candleOptions={({ datumIndex, isPositive, high, low }) => ({
    body: {
      opacity: isPositive ? 1 : 0.75,
    },
    wick: {
      strokeWidth: high - low > 10 ? 2 : 1,
    },
  })}
/>
```

The default render path batches candles by status for performance. Supplying
`candleOptions` opts into per-candle paths so each candle can be styled
individually.

### `animate`

The `animate` prop takes an
[animation config object](../../animated-paths.md#animconfig) and animates the
generated Skia paths when they change.

### Paint properties

The component also passes these paint props to the underlying Skia paths:

- `blendMode`
- `opacity`
- `antiAlias`

## Interaction

`Candlestick` uses the existing `CartesianChart` press model. A touch selects
the nearest x value, and the press state exposes the matching OHLC values:

```ts
state.matchedIndex.value;
state.x.value.value;
state.x.position.value;
state.y.open.value.value;
state.y.high.value.value;
state.y.low.value.value;
state.y.close.value.value;
```

This is designed for mobile scrub interaction. It does not require the touch to
land exactly on the candle body or wick.

## Current Scope

Use numeric timestamps or string categories for `xKey`. True time-scale input
with `Date` values is separate Cartesian scale work.
