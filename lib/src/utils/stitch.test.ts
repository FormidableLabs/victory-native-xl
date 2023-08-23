import { describe, expect, it } from "vitest";
import { stitch } from "./stitch";

describe("stitch", () => {
  it("should stich together array of numbers", () => {
    const xs = [1, 2, 3];
    const ys = [4, 5, 6];
    const result = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    expect(stitch(xs, ys)).toEqual(result);
  });

  it("uses length of first array for the resulting array", () => {
    const xs = [1, 2];
    const ys = [3, 4, 5];
    const result = [
      [1, 3],
      [2, 4],
    ];
    expect(stitch(xs, ys)).toEqual(result);
  });

  it("fills y with NaN if ys is longer than xs", () => {
    const xs = [1, 2, 3];
    const ys = [4, 5];
    const result = [
      [1, 4],
      [2, 5],
      [3, NaN],
    ];
    expect(stitch(xs, ys)).toEqual(result);
  });
});
