# Polar Chart

The `PolarChart` component provides another chart container component in `victory-native`. Its core responsibilities are:

- accepting raw data and metadata in a format that can then be easily transformed and used for charting `Pie` and `Donut` charts.

:::info
This chart does not yet support gestures or animations.
:::

:::tip

The [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) inside this repo has a lot of examples of how to use the `PolarChart` and its associated components!

:::

## Example

The example below shows the most basic use of the `PolarChart`.

```tsx
import { View } from "react-native";
import { Pie } from "victory-native";

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

The only supported `children` of a `PolarChart` is currently a `Pie.Chart` **See the [Pie Chart](<(/pie/pie-charts)>) for more details.**

### `containerStyle`

A `StyleProp<ViewStyle>` that styles the `View` which wraps the `Canvas` of the `Polar` chart.

### `canvasStyle`

A `StyleProp<ViewStyle>` that styles the `Canvas` upon which the `Polar` chart is drawn.
