import { describe, expect, it } from "vitest";
import { getClosestDatumIndex } from "./getClosestDatumIndex";

const categoryPositions = [20, 80, 140, 200];

describe("getClosestDatumIndex", () => {
  it("uses the touch x position for vertical charts", () => {
    expect(
      getClosestDatumIndex({
        orientation: "vertical",
        categoryPositions,
        touchX: 134,
        touchY: 20,
      }),
    ).toBe(2);
  });

  it("uses the touch y position for horizontal charts", () => {
    expect(
      getClosestDatumIndex({
        orientation: "horizontal",
        categoryPositions,
        touchX: 20,
        touchY: 134,
      }),
    ).toBe(2);
  });

  it("ignores a misleading x position for horizontal charts", () => {
    expect(
      getClosestDatumIndex({
        orientation: "horizontal",
        categoryPositions,
        touchX: 200,
        touchY: 82,
      }),
    ).toBe(1);
  });

  it("clamps out-of-range touches through the existing closest-point behavior", () => {
    expect(
      getClosestDatumIndex({
        orientation: "horizontal",
        categoryPositions,
        touchX: 0,
        touchY: -100,
      }),
    ).toBe(0);
    expect(
      getClosestDatumIndex({
        orientation: "horizontal",
        categoryPositions,
        touchX: 0,
        touchY: 300,
      }),
    ).toBe(categoryPositions.length - 1);
  });
});
