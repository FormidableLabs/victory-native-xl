# Horizontal Bar Chart

This guide shows how to create a single-series horizontal bar chart with `CartesianChart` and `HorizontalBar`.

Horizontal bars use the same data shape as vertical bars: `xKey` points at the category field and `yKeys` point at numeric value fields. The difference is `orientation="horizontal"`. In horizontal mode, categories render on the vertical axis and numeric values render on the horizontal axis.

## Basic Example

```tsx
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, HorizontalBar } from "victory-native";
import inter from "../fonts/inter-medium.ttf";

const data = [
  { category: "Audio", revenue: 46 },
  { category: "Books", revenue: 68 },
  { category: "Events", revenue: -28 },
  { category: "Merch", revenue: 12 },
  { category: "Video", revenue: -18 },
  { category: "Web", revenue: 75 },
];

export function RevenueByChannel() {
  const font = useFont(inter, 12);

  return (
    <View style={{ height: 360 }}>
      <CartesianChart
        orientation="horizontal"
        data={data}
        xKey="category"
        yKeys={["revenue"]}
        domain={{ x: [-80, 160] }}
        domainPadding={{ top: 28, bottom: 28, right: 18 }}
        xAxis={{
          font,
          tickCount: 5,
          formatXLabel: (value) => `${value}`,
        }}
        yAxis={[
          {
            yKeys: ["revenue"],
            font,
            tickCount: data.length,
            lineWidth: 0,
          },
        ]}
        frame={{ lineWidth: 0 }}
      >
        {({ points, chartBounds }) => (
          <HorizontalBar
            points={points.revenue}
            chartBounds={chartBounds}
            barWidth={26}
            roundedCorners={{
              topRight: 8,
              bottomRight: 8,
            }}
            labels={{
              font,
              color: "#262626",
              position: "right",
            }}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(420, 0)}
              colors={["#14b8a6", "#6366f150"]}
            />
          </HorizontalBar>
        )}
      </CartesianChart>
    </View>
  );
}
```

## Axis And Domain Rules

Horizontal charts intentionally keep the normal Victory Native data-key contract:

- `xKey` is still the category field in your data.
- `yKeys` are still the numeric value fields.
- `domain.x`, `viewport.x`, and `domainPadding.left/right` apply to the numeric value axis.
- `domainPadding.top/bottom` apply to vertical category spacing.
- Positive values extend right from zero and negative values extend left from zero.

Use a domain that includes zero when you want a stable baseline for positive and negative values:

```tsx
<CartesianChart
  orientation="horizontal"
  data={data}
  xKey="category"
  yKeys={["revenue"]}
  domain={{ x: [-80, 160] }}
>
  {/* ... */}
</CartesianChart>
```

## Labels

`HorizontalBar` supports the same label shape as `Bar`:

```tsx
<HorizontalBar
  points={points.revenue}
  chartBounds={chartBounds}
  labels={{
    font,
    color: "#262626",
    position: "right",
  }}
/>
```

Label positions are screen-relative:

- `"top"` renders above the horizontal bar.
- `"bottom"` renders below the horizontal bar.
- `"left"` renders to the left of the rendered bar.
- `"right"` renders to the right of the rendered bar.

For dense charts or label-position demos, increase the relevant `domainPadding` so labels have room to render without clipping.

## Current Scope

The initial horizontal bar support covers single-series `HorizontalBar` charts and grouped `HorizontalBarGroup` charts. Horizontal bar marks should be rendered inside `CartesianChart orientation="horizontal"`.

Stacked horizontal bars are not part of these components yet; use `StackedBar` for vertical stacked charts.

When using `chartPressState`, the state fields keep their data roles rather than their screen-axis roles. `state.x.value.value` is still the raw category from `xKey`, while `state.x.position.value` is that category's vertical screen position. `state.y[key].value.value` is still the numeric series value, while `state.y[key].position.value` is that value's horizontal screen position.

For API details, see the [`HorizontalBar` component reference](../bar/horizontal-bar.md) and [`HorizontalBarGroup` component reference](../bar/horizontal-bar-group.md).
