import { describe, expect, it } from "vitest";
import { findClosestPoint } from "./findClosestPoint";

const xValues = Array.from({ length: 10 }).map((_, i) => i * 10);

describe("findClosesPoint", () => {
  it("chooses 0-index if target is less than first point", () => {
    expect(findClosestPoint(xValues, -10)).toBe(0);
  });

  it("chooses last-index if target is greater than last point", () => {
    expect(findClosestPoint(xValues, 110)).toBe(xValues.length - 1);
  });

  it("chooses index of closest point", () => {
    expect(findClosestPoint(xValues, 2)).toBe(0);
    expect(findClosestPoint(xValues, 8)).toBe(1);
    expect(findClosestPoint(xValues, 12)).toBe(1);
    expect(findClosestPoint(xValues, 78)).toBe(8);
  });

  it("rounds up if split exactly between two points", () => {
    expect(findClosestPoint(xValues, 5)).toBe(1);
  });
});
