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
});
