# Pie.ChartLegend (Component)

The `Pie.ChartLegend` component renders a legend based on the data supplied to the `Pie` chart. Its core responsibilities are:

- Displaying information about the data in a legible and accessible format, based on a `position` prop.
- Offers sensible defaults with the ability to customize the legend and its children as needed.

:::info

- The `Pie.ChartLegend` currently functions as the "labels" for the `Pie.Chart` component, but in the future, we may add support for a variety of labels within the chart.
- The `Pie.ChartLegend` component is associated with the `Pie.Chart` component and is not meant to be used on its own.

:::

## Example

The example below shows the most basic use of the `Pie.Chart` with a `Pie.ChartLegend`.

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
            position="bottom" // 👈 specify where the legend should go
          />
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

### `position`

A specific value indicating the position of the legend. The value can be one of the following: `"top" | "bottom" | "left" | "right";`. The default value is `"bottom"`.

### `children`

The `children` prop is a render function which maps through the data and whose sole argument is each individual `slice` of the pie, allowing you to customize each legend label as needed. E.g. this slice will have all the data needed to render a `Pie.ChartLegendItem` or your own custom component.

If you do not provide any children, the `Pie.ChartLegend` will just render a simple `Pie.ChartLegendItem />` for each slice. However, you can provide children in order to fully customize the legend items.

See the [Pie.ChartLegendItem](/pie/pie-chart-legend-item) section for more information.

**See the [Render Function Fields](#render-function-fields) section for an outline of all of the available fields on the render function argument.**

The example below shows a more complex use of the `Pie.ChartLegend`:

#### Example

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

### `containerStyle`

A `StyleProp<ViewStyle>` that styles the `View` which wraps the `Pie.Legend` component.

## Render Function Fields

The `Pie.ChartLegend` `children` render function has a single argument that is an object with the following fields.

### `slice`

An object of the form of `PieSliceData` which is the transformed data for each slice of the pie. The `slice` object has the following fields:

```ts
type PieSliceData = {
  center: SkPoint;
  color: Color;
  endAngle: number;
  innerRadius: number;
  label: string;
  radius: number;
  sliceIsEntireCircle: boolean;
  startAngle: number;
  sweepAngle: number;
  value: number;
};
```

You do not need to pass this `slice` to the `Pie.ChartLegendItem` component, but you can use it to customize your own legend items as needed.

## Custom Legend Items

The example below shows an even more complex use of the `Pie.ChartLegend`:

### Example

```tsx
import { View, Text } from "react-native";
import { Pie } from "victory-native";
import { Canvas, Rect } from "@shopify/react-native-skia";

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <Pie.Chart
        data={data}
        labelKey={"label"}
        valueKey={"value"}
        colorKey={"color"}
        renderLegend={() => (
          <Pie.ChartLegend
            containerStyle={{
              justifyContent: "center",
            }}
            position="bottom"
          >
            {/* 👇 draw whatever you want here -- you don't have to use the Pie.ChartLegendItem */}
            {({ slice }) => (
              <View
                style={{
                  marginRight: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* 👇 draw a custom shape instead of a circle, or don't even use Canvas, up to you  */}
                <Canvas style={[{ height: 12, width: 12, marginRight: 4 }]}>
                  <Rect
                    rect={{ x: 0, y: 0, width: 12, height: 12 }}
                    color={slice.color}
                  />
                </Canvas>
                <Text>{slice.label}</Text>
              </View>
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
