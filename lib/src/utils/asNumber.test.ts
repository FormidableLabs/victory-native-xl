import { describe, expect, it } from "vitest";
import { asNumber } from "./asNumber";

describe("asNumber", () => {
  it("should return number if it is a number", () => {
    expect(asNumber(1)).toBe(1);
  });

  it("return NaN if not a number", () => {
    expect(asNumber("1")).toBe(NaN);
    expect(asNumber(false)).toBe(NaN);
    expect(asNumber(true)).toBe(NaN);
    expect(asNumber(undefined)).toBe(NaN);
  });
});
