# Custom Bars

In this guide, we'll show you how to create custom bars in a Cartesian chart.

This first example shows how to customize individual bars without any children based on their index in the data array.

## Simple Customization Example

```tsx
import * as React from "react";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import inter from "../../assets/inter-medium.ttf"; // Wherever your font actually lives

function MyChart() {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{ font }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          {
            /* 👇 map through the yKeys of your data structure */
          }
          return points.highTmp.map((point, index) => {
            return (
              <Bar
                key={index}
                barCount={points.highTmp.length}
                points={[point]} // 👈 Pass in the individual point as a single element array
                chartBounds={chartBounds}
                animate={{ type: "spring" }}
                color={index === data.length - 1 ? "red" : "black"} // 👈 customize as needed!
              />
            );
          });
        }}
      </CartesianChart>
    </View>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
```

## Slightly More Complicated Customization Example

This second example shows how to customize individual bars with children

```tsx
import * as React from "react";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import inter from "../../assets/inter-medium.ttf"; // Wherever your font actually lives

function MyChart() {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  // find the selected active x value
  let activeXItem = useDerivedValue(() => {
    return data.findIndex((value) => value.day === state.x.value.value);
  }).value;
  // or set a default if desired
  if (activeXItem < 0) {
    activeXItem = 2;
  }

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{ font }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          {
            /* 👇 map through the yKeys of your data structure */
          }
          return points.highTmp.map((point, index) => {
            return (
              <Bar
                key={index}
                barCount={points.highTmp.length}
                points={[point]} // 👈 Pass in the individual point as a single element array
                chartBounds={chartBounds}
                animate={{ type: "spring" }}
              >

                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  {/* 👇 using the selected bar, customize children as desired */}
                  colors={
                    i == activeXItem
                      ? ["green", "blue"]
                      : ["#a78bfa", "#a78bfa50"]
                  }
                />
              </Bar>
            );
          });
        }}
      </CartesianChart>
    </View>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
```
