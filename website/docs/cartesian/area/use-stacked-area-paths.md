# `useStackedAreaPaths`

The `useStackedAreaPaths` takes an **array of `Points[]`** as `points`, a `y0` point, a `colors` array, a `curveType`, and an `areaOptions` render prop to customize each layer and returns an array of `StackedAreaPath`.

## Arguments

`useStackedAreaPaths` has a function signature as follows:

```ts
type UseStackedAreaPathArgs = {
  pointsArray: PointsArray[];
  colors: Color[];
  y0: number;
  curveType?: CurveType;
  areaOptions?: ({
    rowIndex,
    lowestY,
    highestY,
  }: {
    rowIndex: number;
    lowestY: number;
    highestY: number;
  }) => CustomizablePathProps & {
    children?: React.ReactNode;
  };
};
```

### `points`

An array of `PointsArrays` that comes from the fields of the `points` object, as illustrated in the example above. You need to specify each key; you can't just do `points={[...points]}`.

### `y0`

A `number` that indicates where the "bottom" of the area path should run. This number should be in _canvas coordinates_.

### `curveType`

[A `CurveType` value](./use-area-path.md#options) that indicates the type of curve should be drawn (e.g. `linear` or `natural`).

### `colors`

The `colors` prop takes an array of `Color` values to use for the layers. The order of the colors should match the order of the `points` prop.

The `areaOptions` prop is a render function with a signature like this:

```tsx
type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;
areaOptions?: ({
    rowIndex,
    lowestY,
    highestY,
  }: {
    rowIndex: number; // the index of the layer
    lowestY: number; // the lowest Y value for this layer
    highestY: number; // the highest Y value for this layer
  }) => CustomizablePathProps & {
    children?: React.ReactNode;
  };
```

This prop allows you to customize each individual layer in the stacked area chart. You can use this to customize the `children` of each areas as well, allowing for things like `LinearGradients`, etc. See the example repo for more information.

## Returns

`useStackedAreaPaths` returns an array of the with the following structure:

```ts
type StackedAreaPath = {
  path: SkPath;
  key: string;
  color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
  };
```

This can then be used to draw the stacked area chart.
