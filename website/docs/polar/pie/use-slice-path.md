# `useSlicePath`

The `useSlicePath` hook takes a `PieSliceData` as input, and returns a Skia `SkPath` path object that represents the path for that pie slice.

:::info

- You wouldn't normally use this unless you were creating entirely custom slices.

:::

## Example

```tsx
import { Pie, useSlicePath, type PieSliceData } from "victory-native";
import { Path } from "@shopify/react-native-skia";
import DATA from "./my-data";

function MyCustomSlice({ slice }: { slice: PieSliceData }) {
  // 👇 use the hook to generate a path object.
  const path = useSlicePath(slice);
  /* 👇 experiment wtih any other customizations you want */
  return <Path path={path} color={slice.color} style="fill" />;
}

export function MyChart() {
  return (
    <PolarChart
      data={DATA}
      colorKey={"color"}
      valueKey={"value"}
      labelKey={"label"}
    >
      <Pie.Chart>
        {/* 👇 pass the PieSliceData to our custom component */}
        {({ slice }) => <MyCustomSlice slice={slice} />}
      </Pie.Chart>
    </PolarChart>
  );
}
```

## Arguments

`useSlicePath` has a function signature as follows:

```ts
useSlicePath(slice: PieSliceData): SkPath
```

### `slice`

The `slice` argument is a `PieSliceData` object used to generate the slices's path. Generally, this data comes from render function of the `Pie.Chart`, as illustrated in the example above.

## Returns

### `path`

The `SkPath` path object to be used as the `path` argument of a Skia `<Path />` element.
