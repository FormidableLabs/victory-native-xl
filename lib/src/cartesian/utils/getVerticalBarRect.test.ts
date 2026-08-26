import { describe, expect, it } from "vitest";
import { getVerticalBarRect } from "./getVerticalBarRect";

describe("getVerticalBarRect", () => {
  it("draws positive values from the value endpoint to the baseline", () => {
    expect(
      getVerticalBarRect({ x: 80, xValue: "A", y: 40, yValue: 8 }, 100, 20),
    ).toEqual({
      x: 70,
      y: 40,
      width: 20,
      height: 60,
    });
  });

  it("preserves negative bar height direction for downstream corner handling", () => {
    expect(
      getVerticalBarRect({ x: 80, xValue: "A", y: 140, yValue: -4 }, 100, 20),
    ).toEqual({
      x: 70,
      y: 140,
      width: 20,
      height: -40,
    });
  });

  it("skips missing or non-finite endpoints", () => {
    expect(
      getVerticalBarRect(
        { x: 80, xValue: "A", y: undefined, yValue: undefined },
        100,
        20,
      ),
    ).toBeNull();
    expect(
      getVerticalBarRect(
        { x: Number.NaN, xValue: "A", y: 40, yValue: undefined },
        100,
        20,
      ),
    ).toBeNull();
  });
});
