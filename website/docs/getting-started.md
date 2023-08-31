# Getting Started

## Installation

Start by installing the peer dependencies of `victory-native` – React Native Reanimated, Gesture Handler, and Skia:

```shell
yarn add react-native-reanimated react-native-gesture-handler react-native-skia
```

For Reanimated, you'll need to add `"react-native-reanimated/plugin"` to your `plugins` list in your `babel.config.js` config file.

Then install `victory-native`:

```shell
yarn add victory-native
```

Now you should be ready to go.

## Your first chart

Let's create a basic line chart on a Cartesian grid. Let's mock out a little bit of dummy data for "high temperature" for each day in a month:

```ts
const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
```

### Instantiate a chart

Now, we'll use the `CartesianChart` component and pass in our data, specifying which property we'll be using for our `x` (independent variable) and `y` (dependent variable) keys.

```tsx
import { View } from "react-native";
import { CartesianChart } from "victory-native";

// ...

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      // 👇 start our chart
      <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]} />
    </View>
  );
}
```

At this point, we're you'll just see a blank view, since we aren't rendering anything useful to our charting canvas.

### Add a line to the chart

The `CartesianChart` uses a render function for its `children` prop. To render content inside of the Cartesian chart, you return Skia elements from the `children` render function. We'll use the `Line` component from `victory-native` to render a line path using our temperature data.

```tsx
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => (
          // 👇 and we'll use the Line component to render a line path.
          <Line points={points.highTmp} color="red" strokeWidth={3} />
        )}
      </CartesianChart>
    </View>
  );
}
```

Now we've got a line path to represent our daily high temperature data!

DOCS:TODO: Maybe a screenshot of this...

### Add some axes

You might want some axes to make your line graph a bit easier to read and interpret. The `CartesianChart` offers out-of-the-box support for axes and grids to make it easy to get up and running with some axes. Let's add some now.

```tsx
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";
// 👇 import a font file you'd like to use for tick labels
import inter from "../assets/inter-medium.ttf";

function MyChart() {
  const font = useFont(inter, 12);

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        // 👇 pass the font, opting in to axes.
        axisOptions={{ font }}
      >
        {({ points }) => (
          <Line points={points.highTmp} color="red" strokeWidth={3} />
        )}
      </CartesianChart>
    </View>
  );
}
```

And now we've got some axes and grid lines!

DOCS:TODO: Screenshot of this.

### Adding a tooltip

DOCS:TODO: Section on creating a basic tooltip
