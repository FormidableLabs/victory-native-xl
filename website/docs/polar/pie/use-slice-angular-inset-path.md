# `useSliceAngularPath`

The `useSliceAngularPath` hook takes a `PieSliceData` as input, and returns an array of Skia `[SkPath, SkPaint]` objects that represent the path and the paint for that pie slice.

:::info

- You wouldn't normally use this unless you were creating entirely custom angular insets.

:::

## Example

```tsx
import { Pie, useSliceAngularPath, type PieSliceData } from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomSliceAngularInset({ slice }: { slice: PieSliceData }) {
  // 👇 use the hook to generate a path and paint object.
  const [path, insetPaint] = useSliceAngularInsetPath({ slice, angularInset });
  /* 👇 experiment wtih any other customizations you want */
  return <Path path={path} paint={insetPaint} {...rest} />;
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

`useSliceAngularPath` has a function signature as follows:

```ts
useSliceAngularPath(slice: PieSliceData): [SkPath, SkPaint]
```

### `slice`

The `slice` argument is a `PieSliceData` object used to generate the slices's path. Generally, this data comes from render function of the `Pie.Chart`, as illustrated in the example above.

## Returns

### [SkPath, SkPaint]

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element. The `SkPaint` path object to be used as the `paint` argument of a Skia `<Path />` element.
