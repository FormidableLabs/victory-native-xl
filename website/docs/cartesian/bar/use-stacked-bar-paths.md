# `useStackedBarGroupPaths`

The `useStackedBarGroupPaths` hook takes an _array_ of `PointsArray`, a `ChartBounds` object, a `barOptions` render prop, an array of colors of type `Color` and some padding options, and returns a list of `StackedBarPath[]` paths.

## Arguments

`useStackedBarGroupPaths` has a function signature as follows:

```ts
useBarGroupPaths(points: PointsArray[];
  chartBounds: ChartBounds;
  innerPadding?: number;
  barWidth?: number;
  barCount?: number;
  colors?: Color[];
  barOptions?: ({
    columnIndex,
    rowIndex,
    isBottom,
    isTop,
  }: {
    isBottom: boolean;
    isTop: boolean;
    columnIndex: number;
    rowIndex: number;
  }) => CustomizablePathProps & { roundedCorners?: RoundedCorners };
```

### `points`

The `points` argument is an _array_ of `PointsArray` arrays used to generate the bars' paths.

### `chartBounds`

A `ChartBounds` object needed to appropriately draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `colors`

The `colors` prop takes an array of `Color` values to use for the bars. The order of the colors should match the order of the `points` prop.

### `barOptions`

The `barOptions` prop is a render function with a signature like this:

```tsx
type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;
barOptions?: ({
    columnIndex,
    rowIndex,
    isBottom,
    isTop,
  }: {
    isBottom: boolean;
    isTop: boolean;
    columnIndex: number;
    rowIndex: number;
  }) => CustomizablePathProps & { roundedCorners?: RoundedCorners };
```

This prop allows you to customize each individual bar in the stacked bar chart. You can use this to customize the children of each bar as well, allowing for things like `LinearGradients`, etc. See the example repo for more information.

## Returns

`useBarGroupPaths` returns an array of the with the following structure:

```ts
type StackedBarPath = {
  path: SkPath;
  key: string;
  color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
  };
```

This can then be used to draw the stacked bar chart.
