# Pie.Slice (Component)

The `Pie.Slice` component is a child component of the `Pie.Chart` component and is responsible for rendering the individual spaces between slices of a `Pie` or `Donut` chart.

:::tip

The [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) inside this repo has a lot of examples of how to use the `Pie.Chart` and its associated components!

:::

## Example

The example below shows how to use `Pie.Slice` to render `LinearGradient` slices.

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
        <Pie.Chart>
          {({ slice }) => {
            // ☝️ render function of each slice object for each pie slice with props described below
            const { startX, startY, endX, endY } = calculateGradientPoints(
              slice.radius,
              slice.startAngle,
              slice.endAngle,
              slice.center.x,
              slice.center.y
            );

            return (
              <Pie.Slice>
                <LinearGradient
                  start={vec(startX, startY)}
                  end={vec(endX, endY)}
                  colors={[slice.color, `${slice.color}50`]}
                  positions={[0, 1]}
                />
              </Pie.Slice>
            );
          }}
        </Pie.Chart>
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

function calculateGradientPoints(
  radius: number,
  startAngle: number,
  endAngle: number,
  centerX: number,
  centerY: number
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

const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));
```

## Props

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

### `animate`

The `animate` prop takes [a `PathAnimationConfig` object](../../animated-paths.md#animconfig) and will animate the path when the points changes.

### `children`

You can optionally provide children in order to add things like `Pie.Label`, and `LinearGradients` amongst other things to each slice, or to wholly customize your own rendering.

### Pie Slice Labels

The `<Pie.Slice />` accepts a `<Pie.Label />` child element that allows for slice label customization.

The `<Pie.Label />` accepts render props, and a custom render function.

`font?: SkFont | null` - Used for calculating the labels position and to be used with the Skia `<Text />` element.

`radiusOffset?: number` - Used to move the slice label closer or further away from the pie chart center.

`color?: Color` - Set the labels color.

`text?: String` - Specify the text to use for the label. Defaults to `slice.label`.

`children?: (position: LabelPosition) => ReactNode` - Render function to allow custom slice labels. The `<Pie.Label />` will do some calculations for you and pass the `position` based on `radiusOffset` you provide.

```tsx
...
<>
  <Pie.Slice>
    {/* 👇 configure slice label with render props */}
    <Pie.Label font={font} color={"white"} />
    <LinearGradient
      start={vec(startX, startY)}
      end={vec(endX, endY)}
      colors={[slice.color, `${slice.color}50`]}
      positions={[0, 1]}
    />
  </Pie.Slice>
  </>
...
```

```tsx
...
<>
  <Pie.Slice>
    {/* 👇 configure custom slice label with render function */}
    <Pie.Label font={font} radiusOffset={0.5}>
      {(position) => <CustomSliceLabel font={font} position={position} />}
    </Pie.Label>
    <LinearGradient
      start={vec(startX, startY)}
      end={vec(endX, endY)}
      colors={[slice.color, `${slice.color}50`]}
      positions={[0, 1]}
    />
  </Pie.Slice>
</>
...
```

:::
