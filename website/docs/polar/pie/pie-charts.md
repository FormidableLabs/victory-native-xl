# Pie.Chart (Component)

The `Pie.Chart` component is a child component of the `PolarChart` component and is responsible for rendering the `Pie` or `Donut` chart.

:::info
This chart does not yet support labels. We are working on adding support for labels in the future. In the meantime, you can easily add your own legend next to the chart. See the [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) for more details.
:::

:::tip

The [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) inside this repo has a lot of examples of how to use the `Pie.Chart` and its associated components!

:::

## Example

The example below shows the most basic use of the `Pie.Chart`.

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

### `innerRadius`

A `number` or `string` (as a percentage) which turns the `Pie` chart into a `Donut` chart. The `innerRadius` prop is the radius of the inner circle of the donut chart. If not provided, the chart will remain a `Pie` chart.

:::tip
The `innerRadius` prop must be a `number` or a `string` like `50%`.
:::

### `children`

The `children` prop is a render function which maps through the data and whose sole argument is each individual `slice` of the pie, allowing you to customize each slice as needed. E.g. this slice will have all the data needed to render a `Pie.Slice />`.

If you do not provide any children, the `Pie.Chart` will just render a simple `Pie.Slice />` for each slice.

However, you can provide children in order to add things like `Pie.SliceAngularInsets` and `LinearGradients` amongst other things to each slice, or to wholly customize your own rendering.

**See the [Render Function Fields](#render-function-fields) section for an outline of all of the available fields on the render function argument.**

The example below shows a more complex use of the `Pie.Chart`:

### Customizing Children Example

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
      >
        {/* 👇 each individual slice */}
        {({ slice }) => {
          const { startX, startY, endX, endY } = calculateGradientPoints(
            slice.radius,
            slice.startAngle,
            slice.endAngle,
            slice.center.x,
            slice.center.y,
          ); // 👈 create your own custom fn to calculate the gradient details (see example app)

          return (
            <>
              {/* 👇 return customized slice here  */}
              <Pie.Slice>
                <LinearGradient
                  start={vec(startX, startY)}
                  end={vec(endX, endY)}
                  colors={[slice.color, `${slice.color}50`]}
                  positions={[0, 1]}
                />
              </Pie.Slice>
              <Pie.SliceAngularInset
                angularInset={{
                  angularStrokeWidth: 5,
                  angularStrokeColor: "white",
                }}
              />
            </>
          );
        }}
      </Pie.Chart>
    </View>
  );
}

function calculateGradientPoints(
  radius: number,
  startAngle: number,
  endAngle: number,
  centerX: number,
  centerY: number,
) {
  // Calculate the midpoint angle of the slice for a central gradient effect
  const midAngle = (startAngle + endAngle) / 2;

  // Convert angles from degrees to radians
  const startRad = (Math.PI / 180) * startAngle;
  const midRad = (Math.PI / 180) * midAngle;

  // Calculate start point (inner edge near the pie's center)
  const startX = centerX + radius * 0.5 * Math.cos(startRad);
  const startY = centerY + radius * 0.5 * Math.sin(startRad);

  // Calculate end point (outer edge of the slice)
  const endX = centerX + radius * Math.cos(midRad);
  const endY = centerY + radius * Math.sin(midRad);

  return { startX, startY, endX, endY };
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

## Render Function Fields

The `Pie.Chart` `children` render function has a single argument that is an object with the following fields.

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

:::info
Generally, you would not need to use the `slice` object directly, but it is available to you if you need to do something custom with each slice. Please refer to the example app repo for more information on how to use the `slice` object e.g the `LinearGradient` examples.
:::
