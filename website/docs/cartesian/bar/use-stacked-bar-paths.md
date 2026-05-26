# `useStackedBarPaths`

The `useStackedBarPaths` hook takes an _array_ of `PointsArray`, a `ChartBounds` object, a `barOptions` render prop, an array of colors of type `Color` and some padding options, and returns a list of `StackedBarPath[]` paths.

## Arguments

`useStackedBarPaths` has a function signature as follows:

```ts
useStackedBarPaths({
  points: PointsArray[];
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
}): StackedBarPath[];
```

### `points`

The `points` argument is an _array_ of `PointsArray` arrays used to generate the bars' paths.

### `chartBounds`

A `ChartBounds` object needed to appropriately draw the bars. This generally comes from the `chartBounds` render argument of `CartesianChart`.

### `colors`

The `colors` prop takes an array of `Color` values to use for the bars. The order of the colors should match the order of the `points` prop.

### `innerPadding`

An optional `number` between 0 and 1 that represents what fraction of the horizontal space between the first and last bars should be "white space". Defaults to `0.25`.

### `barWidth`

An optional explicit width for each stacked bar. This takes precedence over `barCount` and the computed width.

### `barCount`

An optional count used to compute bar width as if there were `barCount` x data points. This is useful for keeping stacked bar widths stable when rendering dynamic subsets of a larger dataset.

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

`useStackedBarPaths` returns an array with the following structure:

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
