import { describe, expect, it } from "vitest";
import { getXScaleInputBounds } from "./getXScaleInputBounds";

describe("getXScaleInputBounds", () => {
  it("uses numerical data bounds by default", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: true,
        ixNum: [2, 4, 6],
      }),
    ).toEqual([2, 6]);
  });

  it("prefers explicit x domain over data bounds", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: true,
        ixNum: [2, 4, 6],
        domain: [0, 10],
      }),
    ).toEqual([0, 10]);
  });

  it("uses tick-derived x domain when explicit domain is omitted", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: true,
        ixNum: [2, 4, 6],
        tickDomain: [1, 9],
      }),
    ).toEqual([1, 9]);
  });

  it("expands equal numerical bounds around the single value", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: true,
        ixNum: [5],
      }),
    ).toEqual([4, 6]);
  });

  it("uses ordinal indexes for non-numerical data", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: false,
        ixNum: [0, 1, 2],
        domain: [10, 20],
        tickDomain: [10, 20],
      }),
    ).toEqual([0, 2]);
  });

  it("expands a single ordinal index around zero", () => {
    expect(
      getXScaleInputBounds({
        isNumericalData: false,
        ixNum: [0],
      }),
    ).toEqual([-1, 1]);
  });
});
