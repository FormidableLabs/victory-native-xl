import { describe, it, expect } from "vitest";
import { makeScale } from "./makeScale";

describe("makeScale", () => {
  it("creates a linear scale mapping input bounds to output bounds", () => {
    const scale = makeScale({ inputBounds: [0, 1], outputBounds: [0, 50] });
    expect(scale(0)).toBe(0);
    expect(scale(0.5)).toBe(25);
    expect(scale(1)).toBe(50);
  });

  it("can pad the output bounds", () => {
    const scale = makeScale({
      inputBounds: [0, 1],
      outputBounds: [0, 400],
      padStart: 10,
      padEnd: 30,
    });
    expect(scale.invert(0)).toBe(-0.025);
    expect(scale(0)).toBeCloseTo(9.09);
    expect(scale(0.5)).toBeCloseTo(190.909);
    expect(scale(1)).toBeCloseTo(372.7272);
    expect(scale.invert(400)).toBe(1.075);
  });

  it('can "nice" the scale', () => {
    const scale = makeScale({
      inputBounds: [0.03, 0.977], // ew, ugly, not nice.
      outputBounds: [0, 100],
      isNice: true,
    });

    expect(scale.invert(0)).toBe(0);
    expect(scale.invert(100)).toBe(1);
  });
});
