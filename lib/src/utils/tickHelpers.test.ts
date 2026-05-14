import { describe, expect, it } from "vitest";
import { downsampleTicks, getDomainFromTicks } from "./tickHelpers";

describe("tickHelpers", () => {
  it("does not derive a domain from empty tick values", () => {
    expect(getDomainFromTicks([])).toBeUndefined();
  });

  it("derives a domain from numeric tick values", () => {
    expect(getDomainFromTicks([4, 8, 12])).toEqual([4, 12]);
  });

  it("returns no ticks when the requested count is zero", () => {
    expect(downsampleTicks([4, 8, 12], 0)).toEqual([]);
  });

  it("downsamples ticks to the requested count", () => {
    expect(downsampleTicks([0, 1, 2, 3, 4], 1)).toEqual([0]);
    expect(downsampleTicks([0, 1, 2, 3, 4], 2)).toEqual([0, 4]);
    expect(downsampleTicks([0, 1, 2, 3, 4], 3)).toEqual([0, 2, 4]);
    expect(downsampleTicks([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4)).toEqual([
      0, 3, 6, 9,
    ]);
  });
});
