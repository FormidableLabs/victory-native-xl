import { describe, expect, it } from "vitest";
import type { PointsArray } from "../../types";
import {
  getHorizontalStackedBarOptionsContext,
  getStackedBarSegments,
  getVerticalStackedBarOptionsContext,
} from "./getStackedBarSegments";

const summarizeSegments = (points: PointsArray[]) =>
  getStackedBarSegments(points).map(
    ({
      categoryKey,
      value,
      startValue,
      endValue,
      seriesIndex,
      datumIndex,
      isPositive,
      isStart,
      isEnd,
    }) => ({
      categoryKey,
      value,
      startValue,
      endValue,
      seriesIndex,
      datumIndex,
      isPositive,
      isStart,
      isEnd,
    }),
  );

describe("getStackedBarSegments", () => {
  it("accumulates positive and negative stacks independently by category", () => {
    const points: PointsArray[] = [
      [{ x: 80, xValue: "A", y: 50, yValue: 10 }],
      [{ x: 80, xValue: "A", y: 75, yValue: 5 }],
      [{ x: 80, xValue: "A", y: 115, yValue: -3 }],
      [{ x: 80, xValue: "A", y: 125, yValue: -2 }],
    ];

    expect(summarizeSegments(points)).toEqual([
      {
        categoryKey: "A",
        value: 10,
        startValue: 0,
        endValue: 10,
        seriesIndex: 0,
        datumIndex: 0,
        isPositive: true,
        isStart: true,
        isEnd: false,
      },
      {
        categoryKey: "A",
        value: 5,
        startValue: 10,
        endValue: 15,
        seriesIndex: 1,
        datumIndex: 0,
        isPositive: true,
        isStart: false,
        isEnd: true,
      },
      {
        categoryKey: "A",
        value: -3,
        startValue: 0,
        endValue: -3,
        seriesIndex: 2,
        datumIndex: 0,
        isPositive: false,
        isStart: true,
        isEnd: false,
      },
      {
        categoryKey: "A",
        value: -2,
        startValue: -3,
        endValue: -5,
        seriesIndex: 3,
        datumIndex: 0,
        isPositive: false,
        isStart: false,
        isEnd: true,
      },
    ]);
  });

  it("keeps category stacks independent across series", () => {
    const points: PointsArray[] = [
      [
        { x: 80, xValue: "A", y: 50, yValue: 10 },
        { x: 120, xValue: "B", y: 85, yValue: 3 },
      ],
      [
        { x: 80, xValue: "A", y: 75, yValue: 5 },
        { x: 120, xValue: "B", y: 110, yValue: -2 },
      ],
    ];

    expect(summarizeSegments(points)).toEqual([
      {
        categoryKey: "A",
        value: 10,
        startValue: 0,
        endValue: 10,
        seriesIndex: 0,
        datumIndex: 0,
        isPositive: true,
        isStart: true,
        isEnd: false,
      },
      {
        categoryKey: "B",
        value: 3,
        startValue: 0,
        endValue: 3,
        seriesIndex: 0,
        datumIndex: 1,
        isPositive: true,
        isStart: true,
        isEnd: true,
      },
      {
        categoryKey: "A",
        value: 5,
        startValue: 10,
        endValue: 15,
        seriesIndex: 1,
        datumIndex: 0,
        isPositive: true,
        isStart: false,
        isEnd: true,
      },
      {
        categoryKey: "B",
        value: -2,
        startValue: 0,
        endValue: -2,
        seriesIndex: 1,
        datumIndex: 1,
        isPositive: false,
        isStart: true,
        isEnd: true,
      },
    ]);
  });

  it("preserves zero-height renderable segments without marking stack ends", () => {
    const points: PointsArray[] = [
      [{ x: 80, xValue: "A", y: 100, yValue: 0 }],
      [{ x: 80, xValue: "A", y: 80, yValue: 4 }],
    ];

    expect(summarizeSegments(points)).toEqual([
      {
        categoryKey: "A",
        value: 0,
        startValue: 0,
        endValue: 0,
        seriesIndex: 0,
        datumIndex: 0,
        isPositive: false,
        isStart: false,
        isEnd: false,
      },
      {
        categoryKey: "A",
        value: 4,
        startValue: 0,
        endValue: 4,
        seriesIndex: 1,
        datumIndex: 0,
        isPositive: true,
        isStart: true,
        isEnd: true,
      },
    ]);
  });

  it("skips missing and non-finite endpoints", () => {
    const points: PointsArray[] = [
      [
        { x: 80, xValue: "A", y: null, yValue: 2 },
        { x: Number.NaN, xValue: "B", y: 80, yValue: 2 },
        { x: 120, xValue: "C", y: 70, yValue: undefined },
      ],
    ];

    expect(summarizeSegments(points)).toEqual([
      {
        categoryKey: "C",
        value: 0,
        startValue: 0,
        endValue: 0,
        seriesIndex: 0,
        datumIndex: 2,
        isPositive: false,
        isStart: false,
        isEnd: false,
      },
    ]);
  });

  it("maps neutral edge fields to vertical bottom/top fields", () => {
    const segments = getStackedBarSegments([
      [{ x: 80, xValue: "A", y: 50, yValue: 10 }],
      [{ x: 80, xValue: "A", y: 75, yValue: 5 }],
      [{ x: 80, xValue: "A", y: 115, yValue: -3 }],
      [{ x: 80, xValue: "A", y: 125, yValue: -2 }],
    ]);

    expect(segments.map(getVerticalStackedBarOptionsContext)).toEqual([
      {
        columnIndex: 0,
        rowIndex: 0,
        seriesIndex: 0,
        datumIndex: 0,
        isStart: true,
        isEnd: false,
        isBottom: true,
        isTop: false,
      },
      {
        columnIndex: 1,
        rowIndex: 0,
        seriesIndex: 1,
        datumIndex: 0,
        isStart: false,
        isEnd: true,
        isBottom: false,
        isTop: true,
      },
      {
        columnIndex: 2,
        rowIndex: 0,
        seriesIndex: 2,
        datumIndex: 0,
        isStart: true,
        isEnd: false,
        isBottom: false,
        isTop: true,
      },
      {
        columnIndex: 3,
        rowIndex: 0,
        seriesIndex: 3,
        datumIndex: 0,
        isStart: false,
        isEnd: true,
        isBottom: true,
        isTop: false,
      },
    ]);
  });

  it("maps neutral edge fields to horizontal left/right fields", () => {
    const segments = getStackedBarSegments([
      [{ x: 80, xValue: "A", y: 50, yValue: 10 }],
      [{ x: 80, xValue: "A", y: 75, yValue: 5 }],
      [{ x: 80, xValue: "A", y: 115, yValue: -3 }],
      [{ x: 80, xValue: "A", y: 125, yValue: -2 }],
    ]);

    expect(segments.map(getHorizontalStackedBarOptionsContext)).toEqual([
      {
        columnIndex: 0,
        rowIndex: 0,
        seriesIndex: 0,
        datumIndex: 0,
        isStart: true,
        isEnd: false,
        isLeft: true,
        isRight: false,
      },
      {
        columnIndex: 1,
        rowIndex: 0,
        seriesIndex: 1,
        datumIndex: 0,
        isStart: false,
        isEnd: true,
        isLeft: false,
        isRight: true,
      },
      {
        columnIndex: 2,
        rowIndex: 0,
        seriesIndex: 2,
        datumIndex: 0,
        isStart: true,
        isEnd: false,
        isLeft: false,
        isRight: true,
      },
      {
        columnIndex: 3,
        rowIndex: 0,
        seriesIndex: 3,
        datumIndex: 0,
        isStart: false,
        isEnd: true,
        isLeft: true,
        isRight: false,
      },
    ]);
  });
});
