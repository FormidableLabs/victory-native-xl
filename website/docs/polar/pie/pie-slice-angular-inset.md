# Pie.SliceAngularInset (Component)

The `Pie.SliceAngularInset` component is a child component of the `Pie.Chart` component and is responsible for rendering the individual slice of a `Pie` or `Donut` chart. By default the `Pie.SliceAngularInset` component will render a simple slice of the pie, but you can customize the rendering of each slice by providing children to the `Pie.Chart` component.

:::tip

The [example app](https://github.com/FormidableLabs/victory-native-xl/tree/main/example) inside this repo has a lot of examples of how to use the `Pie.Chart` and its associated components!

:::

## Example

The example below shows how to use `Pie.SliceAngularInset` to render `LinearGradient` slices.

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
            // ☝️ render function of each slice object for each pie slice
            return (
              <>
                <Pie.Slice />
                <Pie.SliceAngularInset
                  angularInset={{
                    angularStrokeWidth: insetWidth,
                    angularStrokeColor: insetColor,
                  }}
                />
              </>
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
const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));
```

## Props

### angularStrokeWidth

The `angularStrokeWidth` prop is used to set the width of the angular inset stroke.

### angularStrokeColor

The `angularStrokeColor` prop is used to set the color of the angular inset stroke.

### `animate`

The `animate` prop takes [a `PathAnimationConfig` object](../../animated-paths.md#animconfig) and will animate the path when the points changes.

### `children`

This component is just a `Path` under the hood, so accepts most props that a `Path` would accept.
