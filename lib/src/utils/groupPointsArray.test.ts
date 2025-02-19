import { describe, expect, it } from "vitest";
import { groupPointsArray } from "./groupPointsArray";
import type { PointsArray } from "../types";

describe("groupPointsArray", () => {
  it("groups points into continuous numerical y-value segments", () => {
    const points: PointsArray = [
      { x: 1, y: 1, xValue: 1, yValue: 1 },
      { x: 2, y: 2, xValue: 2, yValue: 2 },
      { x: 3, y: null, xValue: 3, yValue: null },
      { x: 4, y: 4, xValue: 4, yValue: 4 },
      { x: 5, y: 5, xValue: 5, yValue: 5 },
      { x: 6, y: undefined, xValue: 6, yValue: undefined },
      { x: 7, y: 7, xValue: 7, yValue: 7 },
    ];

    const result = groupPointsArray(points);

    expect(result).toEqual([
      [
        { x: 1, y: 1, xValue: 1, yValue: 1 },
        { x: 2, y: 2, xValue: 2, yValue: 2 },
      ],
      [
        { x: 4, y: 4, xValue: 4, yValue: 4 },
        { x: 5, y: 5, xValue: 5, yValue: 5 },
      ],
      [{ x: 7, y: 7, xValue: 7, yValue: 7 }],
    ]);
  });

  it("returns empty array if no points have numerical y values", () => {
    const points: PointsArray = [
      { x: 1, y: null, xValue: 1, yValue: null },
      { x: 2, y: undefined, xValue: 2, yValue: undefined },
    ];

    const result = groupPointsArray(points);

    expect(result).toEqual([]);
  });

  it("returns single group if all points have numerical y values", () => {
    const points: PointsArray = [
      { x: 1, y: 1, xValue: 1, yValue: 1 },
      { x: 2, y: 2, xValue: 2, yValue: 2 },
    ];

    const result = groupPointsArray(points);

    expect(result).toEqual([points]);
  });

  it("handles empty input array", () => {
    const points: PointsArray = [];

    const result = groupPointsArray(points);

    expect(result).toEqual([]);
  });
});
