import { describe, expect, it } from "vitest";
import { asNumber } from "./asNumber";

describe("asNumber", () => {
  it("should return number if it is a number", () => {
    expect(asNumber(1)).toBe(1);
  });

  it("should cast to number if not a number", () => {
    expect(asNumber("1")).toBe(1);
    expect(asNumber(false)).toBe(0);
    expect(asNumber(true)).toBe(1);
    expect(asNumber(undefined)).toBe(NaN);
  });
});
