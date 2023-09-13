# Multi Press

In this guide, we'll take the end-result of [the Getting Started guide](../../getting-started.mdx) and add multi-press interaction to it.

The final code of the Getting Started guide is shown below:

```tsx
import * as React from "react";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import inter from "../../assets/inter-medium.ttf"; // Wherever your font actually lives

function MyChart() {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState(["highTmp"]);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{ font }}
        chartPressState={state}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isActive && (
              <ToolTip x={state.x.position} y={state.y.highTmp.position} />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
```

## Tracking multiple presses

To track multiple press gestures on our chart, we create multiple `ChartPressState` values using the `useChartPressState` hook and pass the state values into [the `chartPressState` prop of the `CartesianChart`](../cartesian-chart.md#chartpressstate). Let's do that now.

```tsx
// ... imports

function MyChart() {
  // ...
  // 👇 Create two "chart press state" values
  const { state: firstPress, isActive: isFirstPressActive } =
    useChartPressState(["highTmp"]);
  const { state: secondPress, isActive: isSecondPressActive } =
    useChartPressState(["highTmp"]);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        // ...
        chartPressState={[firstPress, secondPress]} // 👈 Pass state values
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {/* 👇 Update our variable names here. */}
            {isFirstPressActive && (
              <ToolTip
                x={firstPress.x.position}
                y={firstPress.y.highTmp.position}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
```

With this in place, the original `ToolTip` element should continue behaving as it did before. Let's add a second tooltip for when a second press gesture is active on the chart.

## Adding a second Tooltip

We'll use the same `ToolTip` component, but pass it values from our `secondPress` state value. This will make the second tooltip show up when the second press gesture is active.

```tsx
// ... imports

function MyChart() {
  // ...
  const { state: firstPress, isActive: isFirstPressActive } =
    useChartPressState(["highTmp"]);
  const { state: secondPress, isActive: isSecondPressActive } =
    useChartPressState(["highTmp"]);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        // ...
        chartPressState={[firstPress, secondPress]}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isFirstPressActive && (/* ... */)}
            {/* 👇 Add a second tooltip */}
            {isSecondPressActive && (
              <ToolTip
                x={secondPress.x.position}
                y={secondPress.y.highTmp.position}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
```

## Full example

Putting this all together, our code looks something like the following:

```tsx
import * as React from "react";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import inter from "../../assets/inter-medium.ttf";

function MyChart() {
  const font = useFont(inter, 12);
  const { state: firstPress, isActive: isFirstPressActive } =
    useChartPressState(["highTmp"]);
  const { state: secondPress, isActive: isSecondPressActive } =
    useChartPressState(["highTmp"]);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{ font }}
        chartPressState={[firstPress, secondPress]}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isFirstPressActive && (
              <ToolTip
                x={firstPress.x.position}
                y={firstPress.y.highTmp.position}
              />
            )}
            {isSecondPressActive && (
              <ToolTip
                x={secondPress.x.position}
                y={secondPress.y.highTmp.position}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
```
