# Animated Paths

## `useAnimatedPath`

The `useAnimatedPath` hook takes a Skia `SkPath` object and an animation configuration, and returns a Reanimated "derived value" that will animate the path if its points change.

## Example

```tsx
import {
  CartesianChart,
  useLinePath,
  useAnimatedPath,
  type PointsArray,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyAnimatedLine({ points }: { points: PointsArray }) {
  const { path } = useLinePath(points);
  // 👇 create an animated path
  const animPath = useAnimatedPath(path);

  return <Path path={animPath} style="stroke" color="red" strokeWidth={3} />;
}

export function MyChart() {
  return (
    <CartesianChart data={DATA} xKey="x" yKeys={["y"]}>
      {({ points }) => <MyAnimatedLine points={points.y} />}
    </CartesianChart>
  );
}
```

:::info
Skia can only interpolate (and hence animate) paths with the same number of points. Therefore, animating a path will only work if the number of points stays the same.

If you e.g. add a data point to a path, don't expect the path to animate.
:::

## Arguments

`useAnimatedPath` has a function signature as follows:

```ts
useAnimatedPath(path: SkPath, animConfig: PathAnimationConfig): SharedValue<SkPath>;
```

### `path`

An `SkPath` that is e.g. returned from `useLinePath` or `useAreaPath` that should be animated when its points change.

:::info
Animation for bar charts (i.e. `useBarPath`) is not yet supported.
:::

### `animConfig`

The `animConfig` argument is where you specify Reanimated options for animating the path and has a type of:

```ts
type PathAnimationConfig =
  | ({ type: "timing" } & WithTimingConfig)
  | ({ type: "spring" } & WithSpringConfig)
  | ({ type: "decay" } & WithDecayConfig);
```

where `WithTimingConfig`, `WithSpringConfig`, and `WithDecayConfig` are types from `react-native-reanimated`.

Find more information on the specific animation options here:

- [Timing animations.](https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming)
- [Spring animations.](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring)
- [Decay animation.](https://docs.swmansion.com/react-native-reanimated/docs/animations/withDecay)
