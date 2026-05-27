# Headless rendering

Victory Native can render chart content as a **Skia-only subtree** when you opt into headless mode. This is useful for environments that cannot mount React Native views—such as server-side image generation, CLI previews, or email thumbnail pipelines—while still reusing the same chart components and data transforms.

## Requirements

- Set **`explicitSize`** with the target `width` and `height` in pixels.
- Set **`headless={true}`** on `CartesianChart` or `PolarChart`.
- The **host** is responsible for creating an offscreen Skia `Surface`, mounting the returned subtree, and snapshotting or encoding the result.

`headless` without `explicitSize` is ignored; the chart stays in normal mounted mode and waits for `onLayout`.

## Cartesian example

```tsx
import { CartesianChart, Line } from "victory-native";

const width = 400;
const height = 300;

const chart = (
  <CartesianChart
    data={DATA}
    xKey="day"
    yKeys={["value"]}
    explicitSize={{ width, height }}
    headless
  >
    {({ points }) => (
      <Line points={points.value} color="royalblue" strokeWidth={2} />
    )}
  </CartesianChart>
);

// Mount `chart` inside your host's offscreen Skia surface, then snapshot.
```

## Polar example

```tsx
import { Pie, PolarChart } from "victory-native";

const chart = (
  <PolarChart
    data={DATA}
    labelKey="label"
    valueKey="value"
    colorKey="color"
    explicitSize={{ width: 320, height: 320 }}
    headless
  >
    <Pie.Chart />
  </PolarChart>
);
```

## `explicitSize` without `headless`

You can pass **`explicitSize`** alone to skip layout measurement while still rendering the normal React Native container (`View`, `Canvas`, gestures). The chart uses the given dimensions immediately.

## Limitations

| Topic | Behavior |
| --- | --- |
| Gestures | Disabled in headless mode (no `GestureHandlerRootView` or press overlays). |
| `CartesianChartRef.canvas` | `null` in headless mode; use your host surface instead of the chart ref. |
| Polar context | Headless polar charts omit the `its-fine` `Bridge`; context is provided by `PolarChartProvider` wrapping the Skia subtree. |
| Layout gating | Chart children render only after dimensions are known (`explicitSize` or first `onLayout`). |

See also: [`CartesianChart` props](./cartesian/cartesian-chart.md), [`PolarChart` props](./polar/polar-chart.md).
