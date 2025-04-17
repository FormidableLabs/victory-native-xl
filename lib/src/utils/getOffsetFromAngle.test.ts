import { describe, it, expect } from "vitest";
import { getOffsetFromAngle } from "./getOffsetFromAngle";

describe("getOffsetFromAngle", () => {
  it("returns 0 when angle is 0", () => {
    expect(getOffsetFromAngle(0)).toBe(0);
  });

  it("returns 0 when angle is falsy", () => {
    // @ts-expect-error Testing with undefined
    expect(getOffsetFromAngle(undefined)).toBe(0);
    // @ts-expect-error Testing with null
    expect(getOffsetFromAngle(null)).toBe(0);
  });

  it("returns the correct sine value for common angles", () => {
    // sin(30°) ≈ 0.5
    expect(getOffsetFromAngle(30)).toBeCloseTo(0.5);
    
    // sin(45°) ≈ 0.7071
    expect(getOffsetFromAngle(45)).toBeCloseTo(0.7071);
    
    // sin(90°) = 1
    expect(getOffsetFromAngle(90)).toBeCloseTo(1);
    
    // sin(180°) = 0
    expect(getOffsetFromAngle(180)).toBeCloseTo(0);
    
    // sin(270°) = -1
    expect(getOffsetFromAngle(270)).toBeCloseTo(-1);
    
    // sin(360°) = 0
    expect(getOffsetFromAngle(360)).toBeCloseTo(0);
  });
  
  it("handles negative angles correctly", () => {
    // sin(-45°) ≈ -0.7071
    expect(getOffsetFromAngle(-45)).toBeCloseTo(-0.7071);
    
    // sin(-90°) = -1
    expect(getOffsetFromAngle(-90)).toBeCloseTo(-1);
  });
}); 