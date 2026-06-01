import { describe, expect, it } from "vitest";
import { getYScaleInputBounds } from "./getYScaleInputBounds";

const DATA = [
  { x: 0, y: 3, z: 0 },
  { x: 1, y: 7, z: 4 },
  { x: 2, y: 5, z: 10 },
];

describe("getYScaleInputBounds", () => {
  it("uses numeric y data bounds by default", () => {
    expect(
      getYScaleInputBounds({
        data: DATA,
        yKeys: ["y", "z"],
      }),
    ).toEqual({ yMin: 0, yMax: 10 });
  });

  it("ignores missing y values when deriving data bounds", () => {
    expect(
      getYScaleInputBounds({
        data: [
          { x: 0, y: 3 },
          { x: 1, y: null },
          { x: 2, y: 7 },
        ],
        yKeys: ["y"],
      }),
    ).toEqual({ yMin: 3, yMax: 7 });
  });

  it("returns infinities when every y value is missing", () => {
    expect(
      getYScaleInputBounds({
        data: [
          { x: 0, y: null },
          { x: 1, y: undefined },
        ],
        yKeys: ["y"],
      }),
    ).toEqual({ yMin: Infinity, yMax: Number.NEGATIVE_INFINITY });
  });

  it("prefers explicit domain over data and tick bounds", () => {
    expect(
      getYScaleInputBounds({
        data: DATA,
        yKeys: ["y"],
        domain: [2, 8],
        tickDomain: [0, 10],
      }),
    ).toEqual({ yMin: 2, yMax: 8 });
  });

  it("uses tick-derived bounds when explicit domain is omitted", () => {
    expect(
      getYScaleInputBounds({
        data: DATA,
        yKeys: ["y"],
        tickDomain: [0, 12],
      }),
    ).toEqual({ yMin: 0, yMax: 12 });
  });

  it("fills a one-sided domain from the data max", () => {
    expect(
      getYScaleInputBounds({
        data: DATA,
        yKeys: ["y"],
        domain: [2],
      }),
    ).toEqual({ yMin: 2, yMax: 7 });
  });
});
