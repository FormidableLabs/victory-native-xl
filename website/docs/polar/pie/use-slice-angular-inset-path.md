# `useSliceAngularInsetPath`

The `useSliceAngularInsetPath` hook takes `PieSliceData` and angular inset styling as input, and returns an array of Skia `[SkPath, SkPaint]` objects that represent the path and paint for that pie slice.

:::info

- You wouldn't normally use this unless you were creating entirely custom angular insets.

:::

## Example

```tsx
import {
  Pie,
  PolarChart,
  useSliceAngularInsetPath,
  type PieSliceData,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomSliceAngularInset({ slice }: { slice: PieSliceData }) {
  const angularInset = {
    angularStrokeColor: "white",
    angularStrokeWidth: 4,
  };
  // 👇 The paint remains available as the second tuple item for compatibility.
  const [path] = useSliceAngularInsetPath({ slice, angularInset });
  /* 👇 experiment with any other customizations you want */
  return (
    <Path
      path={path}
      style="stroke"
      color={angularInset.angularStrokeColor}
      strokeWidth={angularInset.angularStrokeWidth}
    />
  );
}

export function MyChart() {
  return (
    <PolarChart data={DATA} labelKey="title" colorKey="palette" valueKey="high">
      <Pie.Chart>
        {/* 👇 pass the PieSliceData to our custom component */}
        {({ slice }) => <MyCustomSliceAngularInset slice={slice} />}
      </Pie.Chart>
    </PolarChart>
  );
}
```

## Arguments

`useSliceAngularInsetPath` has a function signature as follows:

```ts
useSliceAngularInsetPath({
  slice: PieSliceData,
  angularInset: PieSliceAngularInsetData,
}): readonly [SkPath, SkPaint]
```

### `slice`

The `slice` argument is a `PieSliceData` object used to generate the slice's path. Generally, this data comes from the render function of `Pie.Chart`, as illustrated in the example above.

## Returns

### [SkPath, SkPaint]

The `SkPath` object to be used as the `path` argument of a Skia `<Path />` element. The `SkPaint` object can be used as the `paint` argument of a Skia `<Path />` element.

For consistent rendering across native and web, prefer styling the path with explicit `style`, `color`, and `strokeWidth` props as shown above. The `SkPaint` tuple item remains available for backward compatibility.
