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
    seriesIndex,
    datumIndex,
    isStart,
    isEnd,
  }: {
    isBottom: boolean;
    isTop: boolean;
    columnIndex: number;
    rowIndex: number;
    isStart: boolean;
    isEnd: boolean;
    seriesIndex: number;
    datumIndex: number;
  }) => CustomizablePathProps & {
    roundedCorners?: RoundedCorners;
    children?: React.ReactNode;
  };
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
    seriesIndex,
    datumIndex,
    isStart,
    isEnd,
  }: {
    isBottom: boolean;
    isTop: boolean;
    columnIndex: number;
    rowIndex: number;
    isStart: boolean;
    isEnd: boolean;
    seriesIndex: number;
    datumIndex: number;
  }) => CustomizablePathProps & {
    roundedCorners?: RoundedCorners;
    children?: React.ReactNode;
  };
```

This prop allows you to customize each individual segment in the stacked bar chart. `seriesIndex` and `datumIndex` identify the rendered series and datum; `columnIndex` and `rowIndex` are kept as backwards-compatible aliases for the same values. `isStart` identifies the segment closest to the baseline for that positive or negative stack, and `isEnd` identifies the outer visible end of that stack. `isBottom` and `isTop` remain available for vertical stacked bars and are derived from `isStart`/`isEnd`, including negative values. You can also customize the children of each segment, allowing for things like `LinearGradients`, etc. See the example repo for more information.

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

For horizontal stacked paths, use `useHorizontalStackedBarPaths` with `CartesianChart orientation="horizontal"`. Its arguments mirror this hook and its `barOptions` callback receives the horizontal `isLeft` and `isRight` screen-side fields instead of vertical `isBottom` and `isTop` fields.
