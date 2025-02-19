import { describe, expect, it } from "vitest";
import { downsampleTicks, getDomainFromTicks } from "./tickHelpers";

describe("tickHelpers", () => {
  describe("downsampleTicks", () => {
    it("returns original array if length is less than or equal to tickCount", () => {
      const ticks = [1, 2, 3];
      expect(downsampleTicks(ticks, 5)).toEqual(ticks);
    });

    it("downsamples array to approximately tickCount items", () => {
      const ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const result = downsampleTicks(ticks, 5);
      expect(result).toEqual([0, 2, 4, 6, 8]);
    });

    it("throws error if array contains non-numbers", () => {
      const ticks = [1, "abc", 3] as unknown as number[];
      expect(() => downsampleTicks(ticks, 2)).toThrow(
        "TickValues array must only contain numbers.",
      );
    });

    it("returns original array if tickCount is falsy", () => {
      const ticks = [1, 2, 3, 4, 5];
      expect(downsampleTicks(ticks, 0)).toEqual(ticks);
    });
  });

  describe("getDomainFromTicks", () => {
    it("returns min and max from tick values", () => {
      const ticks = [5, 2, 8, 1, 9];
      expect(getDomainFromTicks(ticks)).toEqual([1, 9]);
    });

    it("returns undefined if ticks array is undefined", () => {
      expect(getDomainFromTicks(undefined)).toBeUndefined();
    });

    it("coerces non-numbers to indices", () => {
      const ticks = ["a", "b", "c"] as unknown as number[];
      expect(getDomainFromTicks(ticks)).toEqual([0, 2]);
    });

    it("handles mixed number and non-number values", () => {
      const ticks = [1, "b", 3] as unknown as number[];
      expect(getDomainFromTicks(ticks)).toEqual([1, 3]);
    });
  });
});
