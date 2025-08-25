import { describe, expect, it } from "vitest";
import { cleanPointsArray } from "./cleanPointsArray";
import type { PointsArray } from "../types";

describe("cleanPointsArray", () => {
  it("filters out points with non-numerical y values", () => {
    const points: PointsArray = [
      { x: 1, y: 1, xValue: 1, yValue: 1 },
      { x: 2, y: null, xValue: 2, yValue: null },
      { x: 3, y: 3, xValue: 3, yValue: 3 },
      { x: 4, y: undefined, xValue: 4, yValue: undefined },
      { x: 5, y: 5, xValue: 5, yValue: 5 },
    ];

    const result = cleanPointsArray(points);

    expect(result).toEqual([
      { x: 1, y: 1, xValue: 1, yValue: 1 },
      { x: 3, y: 3, xValue: 3, yValue: 3 },
      { x: 5, y: 5, xValue: 5, yValue: 5 },
    ]);
  });

  it("returns empty array if all points have non-numerical y values", () => {
    const points: PointsArray = [
      { x: 1, y: null, xValue: 1, yValue: null },
      { x: 2, y: undefined, xValue: 2, yValue: undefined },
    ];

    const result = cleanPointsArray(points);

    expect(result).toEqual([]);
  });

  it("returns original array if all points have numerical y values", () => {
    const points: PointsArray = [
      { x: 1, y: 1, xValue: 1, yValue: 1 },
      { x: 2, y: 2, xValue: 2, yValue: 2 },
    ];

    const result = cleanPointsArray(points);

    expect(result).toEqual(points);
  });
});
