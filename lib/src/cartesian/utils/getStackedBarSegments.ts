import type { InputFieldType, PointsArray } from "../../types";

type Point = PointsArray[number];

export type StackedBarSegment = {
  point: Point;
  categoryKey: InputFieldType;
  value: number;
  startValue: number;
  endValue: number;
  seriesIndex: number;
  datumIndex: number;
  isPositive: boolean;
  isStart: boolean;
  isEnd: boolean;
};

export type StackedBarOptionsBaseContext = {
  columnIndex: number;
  rowIndex: number;
  isStart: boolean;
  isEnd: boolean;
  seriesIndex: number;
  datumIndex: number;
};

export type VerticalStackedBarOptionsContext = StackedBarOptionsBaseContext & {
  isBottom: boolean;
  isTop: boolean;
};

export type HorizontalStackedBarOptionsContext =
  StackedBarOptionsBaseContext & {
    isLeft: boolean;
    isRight: boolean;
  };

type CategoryStack = {
  positiveTotal: number;
  negativeTotal: number;
  positiveSegments: StackedBarSegment[];
  negativeSegments: StackedBarSegment[];
};

export const getStackedBarSegments = (
  points: PointsArray[],
): StackedBarSegment[] => {
  const stacksByCategory = new Map<InputFieldType, CategoryStack>();
  const segments: StackedBarSegment[] = [];

  points.forEach((pointsArray, seriesIndex) => {
    pointsArray.forEach((point, datumIndex) => {
      if (!hasRenderableEndpoint(point)) return;

      const categoryKey = point.xValue;
      const stack = getCategoryStack(stacksByCategory, categoryKey);
      const value = getFiniteValue(point.yValue);

      if (value === 0) {
        segments.push({
          point,
          categoryKey,
          value,
          startValue: 0,
          endValue: 0,
          seriesIndex,
          datumIndex,
          isPositive: false,
          isStart: false,
          isEnd: false,
        });
        return;
      }

      const isPositive = value > 0;
      const signSegments = isPositive
        ? stack.positiveSegments
        : stack.negativeSegments;
      const startValue = isPositive ? stack.positiveTotal : stack.negativeTotal;
      const endValue = startValue + value;
      const segment: StackedBarSegment = {
        point,
        categoryKey,
        value,
        startValue,
        endValue,
        seriesIndex,
        datumIndex,
        isPositive,
        isStart: signSegments.length === 0,
        isEnd: false,
      };

      signSegments.push(segment);
      segments.push(segment);

      if (isPositive) {
        stack.positiveTotal = endValue;
      } else {
        stack.negativeTotal = endValue;
      }
    });
  });

  stacksByCategory.forEach(({ positiveSegments, negativeSegments }) => {
    const positiveEnd = positiveSegments.at(-1);
    const negativeEnd = negativeSegments.at(-1);

    if (positiveEnd) positiveEnd.isEnd = true;
    if (negativeEnd) negativeEnd.isEnd = true;
  });

  return segments;
};

export const getVerticalStackedBarOptionsContext = (
  segment: StackedBarSegment,
): VerticalStackedBarOptionsContext => {
  const { seriesIndex, datumIndex, isPositive, isStart, isEnd } = segment;

  return {
    columnIndex: seriesIndex,
    rowIndex: datumIndex,
    seriesIndex,
    datumIndex,
    isStart,
    isEnd,
    isBottom: isPositive ? isStart : isEnd,
    isTop: isPositive ? isEnd : isStart,
  };
};

export const getHorizontalStackedBarOptionsContext = (
  segment: StackedBarSegment,
): HorizontalStackedBarOptionsContext => {
  const { seriesIndex, datumIndex, isPositive, isStart, isEnd } = segment;

  return {
    columnIndex: seriesIndex,
    rowIndex: datumIndex,
    seriesIndex,
    datumIndex,
    isStart,
    isEnd,
    isLeft: isPositive ? isStart : isEnd,
    isRight: isPositive ? isEnd : isStart,
  };
};

const getCategoryStack = (
  stacksByCategory: Map<InputFieldType, CategoryStack>,
  categoryKey: InputFieldType,
): CategoryStack => {
  const stack = stacksByCategory.get(categoryKey);

  if (stack) return stack;

  const nextStack: CategoryStack = {
    positiveTotal: 0,
    negativeTotal: 0,
    positiveSegments: [],
    negativeSegments: [],
  };
  stacksByCategory.set(categoryKey, nextStack);

  return nextStack;
};

const hasRenderableEndpoint = (point: Point) =>
  typeof point.y === "number" &&
  Number.isFinite(point.x) &&
  Number.isFinite(point.y);

const getFiniteValue = (value: Point["yValue"]) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;
