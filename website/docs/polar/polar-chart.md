# Polar Chart

The `PolarChart` component provides another chart container component in `victory-native`. Its core responsibilities are:

- accepting raw data and metadata in a format that can then be easily transformed and used for charting `Pie` and `Donut` charts.


:::tip

The [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) inside this repo has a lot of examples of how to use the `PolarChart` and its associated components!

:::

## Example

The example below shows the most basic use of the `PolarChart`.

```tsx
import { View } from "react-native";
import { Pie, PolarChart } from "victory-native";

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <PolarChart
        data={DATA} // 👈 specify your data
        labelKey={"label"} // 👈 specify data key for labels
        valueKey={"value"} // 👈 specify data key for values
        colorKey={"color"} // 👈 specify data key for color
      >
        <Pie.Chart />
      </PolarChart>
    </View>
  );
}

// helper functions for example purposes:
function randomNumber() {
  return Math.floor(Math.random() * 26) + 125;
}
function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff);
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}
const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));
```

## Props

### `data` (required)

An array of objects to be used as data points for the chart.

### `labelKey` (required)

A `string` value indicating the _key_ of each `data[number]` object to be used. Currently only used on the legend part of the chart. In the future we may add support for a variety of labels within the chart. The value of the label can be a `string` | `number`

### `valueKey` (required)

A `string` value indicating the _key_ of each `data[number]` object to be used to draw a slice of the Pie.

:::info
The `valueKey` prop must be a key for a field that has a `number` value. That is, only `number`s can be used as dependent values for charting purposes.
:::

### `colorKey` (required)

A `string` value indicating the _key_ of each `data[number]` object to be used to draw a slice of the Pie.

:::info
The `valueKey` prop must be a key for a field that has a Skia `Color` value.
:::

### `children`

The only supported `children` of a `PolarChart` is currently a `Pie.Chart` **See the [Pie Chart](/docs/polar/pie/pie-charts) for more details.**

### `containerStyle`

A `StyleProp<ViewStyle>` that styles the `View` which wraps the `Canvas` of the `Polar` chart.

### `canvasStyle`

A `StyleProp<ViewStyle>` that styles the `Canvas` upon which the `Polar` chart is drawn.

### `explicitSize`

An object `{ width: number; height: number }` that seeds chart dimensions without waiting for React Native `onLayout`. **Required when using `headless`.** See [Headless rendering](../headless-rendering.md).

### `headless`

When `true` (and `explicitSize` is set), renders a Skia-only subtree with no `View`, `Canvas`, or gesture handlers—intended for offscreen render hosts. See [Headless rendering](../headless-rendering.md).

### `enableHover`

When `true`, the chart builds a [`Gesture.Hover()`](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/hover-gesture) to track the pointer — e.g. a mouse on web or desktop — as it moves over the chart. The pointer position is written into the chart context (inverted through the active `transformState`, when provided), and consumed through the [`chartHoverState`](#charthoverstate) behavior below. This enables hover interactions for `Pie` and `Donut` charts without any extra gesture code.

Hover is aimed at pointer devices, so `enableHover` **defaults to `true` on web** (pass `enableHover={false}` there to opt out); on other platforms it stays opt-in.

The hover gesture is composed simultaneously with the transform gestures, so it does not compete with (or break) existing interactions.

### `chartHoverState`

Optional. A Reanimated shared value object which receives the index of the data point (slice) currently under the pointer, or `-1` when the pointer is over the donut hole, outside the pie, or off the chart entirely.

When omitted, `PolarChart` maintains a built-in hover state, which chart content reads with the [`usePieHoverState`](#charthoverstate) hook — so hover highlighting inside `Pie.Chart` needs no extra setup:

```tsx
import * as React from "react";
import { Text } from "react-native-skia";
import { Pie, PolarChart, usePieHoverState } from "victory-native";
import { useDerivedValue } from "react-native-reanimated";

function HoverReadout() {
  // 👈 the built-in hover state; no `chartHoverState` prop needed
  const hover = usePieHoverState();
  const text = useDerivedValue(() =>
    hover.index.value >= 0 ? "Slice hovered!" : "Hover the pie!",
  );

  return (
    <View style={{ height: 300 }}>
      <PolarChart
        data={data}
        valueKey={"value"}
        labelKey={"label"}
        colorKey={"color"}
      >
        <Pie.Chart />
        {/* 👇 drawn on the chart */}
        <Text text={text} x={16} y={24} font={font} />
      </PolarChart>
    </View>
  );
}
```

Pass your own `chartHoverState` only when the hovered index must be consumed *outside* the chart — e.g. a readout rendered above the `Canvas`, where the shared value needs to live in your component:

```tsx
import * as React from "react";
import { View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedText } from "./components/AnimatedText";

function HoveredPie() {
  const [data, setData] = React.useState(DATA(5));

  // 👇 a shared value receiving the hovered slice index (-1 = none)
  const hoverIndex = useSharedValue(-1);

  const hoveredLabel = useDerivedValue(() => {
    const i = hoverIndex.value;
    return i >= 0 && i < data.length ? data[i].label : "Hover the pie!";
  });

  return (
    <View style={{ height: 300 }}>
      <AnimatedText text={hoveredLabel} defaultValue="Hover the pie!" />

      <PolarChart
        data={data}
        valueKey={"value"}
        labelKey={"label"}
        colorKey={"color"}
        chartHoverState={{ index: hoverIndex }} // 👈 your own hover state
      >
        <Pie.Chart />
      </PolarChart>
    </View>
  );
}
```

:::info

The slice geometry (including each slice's `innerRadius`, start/end angles, values, labels, and colors) is available to `Pie.Chart`'s `children` render prop — combine it with `chartHoverState` to style or animate the hovered slice.

:::

### `chartHoverConfig`

Optional configuration for the hover gesture created by `enableHover`. It accepts an object with the following optional properties:

- `activeCursor`: the cursor to use while the pointer is over the chart. Supports all CSS cursor values (e.g. `"pointer"`, `"crosshair"`). Web/desktop only.
- `simultaneousWithExternalGesture`: one or more external Gesture Handler gesture refs that the hover gesture composes with simultaneously — useful when custom gestures are built outside the chart.
