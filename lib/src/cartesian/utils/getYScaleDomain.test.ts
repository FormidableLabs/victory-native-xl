import { describe, expect, it } from "vitest";
import { getYScaleDomain } from "./getYScaleDomain";

describe("getYScaleDomain", () => {
  it("returns flipped y bounds for canvas coordinates", () => {
    expect(getYScaleDomain({ yMin: 3, yMax: 7 })).toEqual([7, 3]);
  });

  it("falls back to a finite linear domain for missing bounds", () => {
    expect(
      getYScaleDomain({ yMin: Infinity, yMax: Number.NEGATIVE_INFINITY }),
    ).toEqual([1, -1]);
  });

  it("expands equal linear bounds around the single value", () => {
    expect(getYScaleDomain({ yMin: 5, yMax: 5 })).toEqual([6, 4]);
  });

  it("falls back to a positive log domain for invalid log bounds", () => {
    expect(getYScaleDomain({ yMin: 0, yMax: 10, yAxisScale: "log" })).toEqual([
      10, 1,
    ]);
    expect(getYScaleDomain({ yMin: -2, yMax: 10, yAxisScale: "log" })).toEqual([
      10, 1,
    ]);
  });

  it("expands equal positive log bounds multiplicatively", () => {
    expect(getYScaleDomain({ yMin: 5, yMax: 5, yAxisScale: "log" })).toEqual([
      50, 0.5,
    ]);
  });
});
