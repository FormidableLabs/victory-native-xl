# Pie.ChartLegendItem (Component)

The `Pie.ChartLegendItem` component renders a simple legend item based on the data supplied to the `Pie` chart. Its core responsibilities are:

- Simply display information associated with the data (color and label) in a legible and accessible format.
- Offers complete customization of the legend item as needed.

:::info

- The `Pie.ChartLegendItem` component is associated with the `Pie.ChartLegend` component and is not meant to be used on its own.

:::

## Example

The example below shows the most basic use of the `Pie.ChartLegendItem` within a `Pie.ChartLegend`.

```tsx
import { View } from "react-native";
import { Pie } from "victory-native";

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <Pie.Chart
        data={DATA} // 👈 specify your data
        labelKey={"label"} // 👈 specify data key for labels
        valueKey={"value"} // 👈 specify data key for values
        colorKey={"color"} // 👈 specify data key for color
        renderLegend={() => (
          <Pie.ChartLegend
            containerStyle={{
              justifyContent: "center",
            }}
            position="top"
          >
            {({ slice }) => (
              <Pie.ChartLegendItem
                formatLabel={(label) =>
                  `${label.toUpperCase()} - ${slice.color}`
                }
              />
            )}
          </Pie.ChartLegend>
        )}
      />
    </View>
  );
}

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

### `formatLabel`

A function that takes a `string` and returns a `string`. This function is used to format the label of the legend item. The default value is `(label) => label`.

### `containerStyle`

A `StyleProp<ViewStyle>` that styles the `View` which wraps the `Pie.ChartLegendItem` component.

### `canvasStyle`

A `StyleProp<ViewStyle>` that styles the `Canvas` which wraps the colored adornment of `Pie.ChartLegendItem` component.

### `textStyle`

A `StyleProp<TextStyle>` that styles the `Text` which wraps the label of the `Pie.ChartLegendItem` component.
