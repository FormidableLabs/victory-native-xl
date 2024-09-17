import { describe, expect, it } from "vitest";
import type { PointsArray } from "victory-native";
import { stitchDataArray } from "./stitchDataArray";
import type { MaybeNumber } from "../types";

describe("stitchDataArray", () => {
  it("does basic stitching", () => {
    const DATA: PointsArray = [
      makePoint(1, 1),
      makePoint(2, 5),
      makePoint(3, 2),
    ];

    expect(stitchDataArray(DATA)).toEqual([
      [1, 1],
      [2, 5],
      [3, 2],
    ]);
  });

  it("omits data points with non-numerical y values", () => {
    const DATA: PointsArray = [
      makePoint(1, 1),
      makePoint(2, null),
      makePoint(3, 2),
    ];

    expect(stitchDataArray(DATA)).toEqual([
      [1, 1],
      [3, 2],
    ]);
  });
});

const makePoint = (x: number, y: MaybeNumber) => ({
  x,
  y,
  xValue: x,
  yValue: y,
});
