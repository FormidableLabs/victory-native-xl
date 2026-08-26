import { describe, expect, it } from "vitest";
import { getBarGroupOffset } from "./getBarGroupOffset";

describe("getBarGroupOffset", () => {
  it("places grouped bars from the leading edge of the group", () => {
    expect(
      getBarGroupOffset({
        groupWidth: 40,
        barWidth: 10,
        gapWidth: 5,
        barIndex: 0,
      }),
    ).toBe(-20);
    expect(
      getBarGroupOffset({
        groupWidth: 40,
        barWidth: 10,
        gapWidth: 5,
        barIndex: 1,
      }),
    ).toBe(-5);
    expect(
      getBarGroupOffset({
        groupWidth: 40,
        barWidth: 10,
        gapWidth: 5,
        barIndex: 2,
      }),
    ).toBe(10);
  });
});
