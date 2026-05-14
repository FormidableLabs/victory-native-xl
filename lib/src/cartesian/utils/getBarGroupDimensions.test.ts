import { describe, expect, it } from "vitest";
import { getBarGroupDimensions } from "./getBarGroupDimensions";

const chartBounds = {
  left: 20,
  right: 220,
};

describe("getBarGroupDimensions", () => {
  it("calculates group, bar, and gap widths from group padding", () => {
    expect(
      getBarGroupDimensions({
        chartBounds,
        betweenGroupPadding: 0.2,
        withinGroupPadding: 0.25,
        groupCount: 4,
        barsPerGroup: 3,
      }),
    ).toEqual({
      groupWidth: 40,
      barWidth: 10,
      gapWidth: 5,
    });
  });

  it("respects an explicit zero custom bar width", () => {
    expect(
      getBarGroupDimensions({
        chartBounds,
        betweenGroupPadding: 0.2,
        withinGroupPadding: 0.25,
        groupCount: 4,
        barsPerGroup: 3,
        customBarWidth: 0,
      }),
    ).toEqual({
      groupWidth: 40,
      barWidth: 0,
      gapWidth: 20,
    });
  });

  it("uses barCount when it is positive", () => {
    expect(
      getBarGroupDimensions({
        chartBounds,
        betweenGroupPadding: 0.2,
        withinGroupPadding: 0.25,
        groupCount: 4,
        barsPerGroup: 3,
        barCount: 6,
      }).barWidth,
    ).toBe(5);
  });
});
