import { describe, expect, it } from "vitest";
import { getHorizontalBarRect } from "./getHorizontalBarRect";

describe("getHorizontalBarRect", () => {
  it("draws positive values from the baseline to the value endpoint", () => {
    expect(
      getHorizontalBarRect({ x: 180, xValue: "A", y: 40, yValue: 8 }, 100, 20),
    ).toEqual({
      x: 100,
      y: 30,
      width: 80,
      height: 20,
    });
  });

  it("draws negative values left of the baseline", () => {
    expect(
      getHorizontalBarRect({ x: 60, xValue: "A", y: 40, yValue: -4 }, 100, 20),
    ).toEqual({
      x: 60,
      y: 30,
      width: 40,
      height: 20,
    });
  });

  it("skips missing or non-finite endpoints", () => {
    expect(
      getHorizontalBarRect(
        { x: Number.NaN, xValue: "A", y: 40, yValue: undefined },
        100,
        20,
      ),
    ).toBeNull();
  });
});
