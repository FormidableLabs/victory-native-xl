# `useSliceAngularInsetPath`

The `useSliceAngularInsetPath` hook takes a `PieSliceData` as input, and returns a `SkPath` object that represents the path for that pie slice.

:::info

- You wouldn't normally use this unless you were creating entirely custom angular insets.

:::

## Example

```tsx
import { Pie, useSliceAngularInsetPath, type PieSliceData } from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomSliceAngularInset({ slice }: { slice: PieSliceData }) {
  // 👇 use the hook to generate a path and paint object.
  const path = useSliceAngularInsetPath({ slice });
  /* 👇 experiment with any other customizations you want */
  return <Path path={path} style="stroke" strokeWidth={4} color="lightblue" {...rest} />;
}

export function MyChart() {
  return (
    <Pie.Chart data={DATA} labelKey="title" colorKey="palette" valueKey="high">
      {/* 👇 pass the PieSliceData to our custom component */}
      {({ slice }) => <MyCustomSliceAngularInset slice={slice} />}
    </Pie.Chart>
  );
}
```

## Arguments

`useSliceAngularInsetPath` has a function signature as follows:

```ts
useSliceAngularInsetPath(slice: PieSliceData): SkPath
```

### `slice`

The `slice` argument is a `PieSliceData` object used to generate the slices's path. Generally, this data comes from render function of the `Pie.Chart`, as illustrated in the example above.

## Returns

### SkPath

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element.
