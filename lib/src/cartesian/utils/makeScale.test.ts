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

  it("maps a viewport into the output bounds while preserving the full input domain", () => {
    const scale = makeScale({
      inputBounds: [0, 10],
      outputBounds: [0, 100],
      viewport: [2, 4],
    });

    expect(scale.domain()).toEqual([0, 10]);
    expect(scale(2)).toBe(0);
    expect(scale(3)).toBe(50);
    expect(scale(4)).toBe(100);
    expect(scale(0)).toBe(-100);
    expect(scale(10)).toBe(400);
  });

  it("applies padding to a viewport without replacing the full input domain", () => {
    const scale = makeScale({
      inputBounds: [0, 10],
      outputBounds: [0, 100],
      viewport: [2, 4],
      padStart: 10,
      padEnd: 10,
    });

    expect(scale.domain()).toEqual([0, 10]);
    expect(scale(2)).toBeCloseTo(10);
    expect(scale(3)).toBeCloseTo(50);
    expect(scale(4)).toBeCloseTo(90);
    expect(scale(0)).toBeCloseTo(-70);
    expect(scale(10)).toBeCloseTo(330);
  });

  it("creates a log scale", () => {
    const scale = makeScale({
      inputBounds: [1, 100],
      outputBounds: [0, 2],
      axisScale: "log",
    });

    expect(scale(1)).toBeCloseTo(0);
    expect(scale(10)).toBeCloseTo(1);
    expect(scale(100)).toBeCloseTo(2);
  });

  it("maps a log viewport into the output bounds while preserving the full input domain", () => {
    const scale = makeScale({
      inputBounds: [1, 1000],
      outputBounds: [0, 100],
      viewport: [10, 100],
      axisScale: "log",
    });

    expect(scale.domain()).toEqual([1, 1000]);
    expect(scale(10)).toBeCloseTo(0);
    expect(scale(100)).toBeCloseTo(100);
    expect(scale(1)).toBeCloseTo(-100);
    expect(scale(1000)).toBeCloseTo(200);
  });
});
