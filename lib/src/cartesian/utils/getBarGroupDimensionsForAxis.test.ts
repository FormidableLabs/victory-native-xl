import { describe, expect, it } from "vitest";
import { getBarGroupDimensionsForAxis } from "./getBarGroupDimensionsForAxis";

describe("getBarGroupDimensionsForAxis", () => {
  it("calculates group, bar, and gap widths from a generic axis range", () => {
    expect(
      getBarGroupDimensionsForAxis({
        axisStart: 20,
        axisEnd: 220,
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

  it("works with vertical screen-axis ranges for future horizontal groups", () => {
    const dimensions = getBarGroupDimensionsForAxis({
      axisStart: 30,
      axisEnd: 330,
      betweenGroupPadding: 0.2,
      withinGroupPadding: 0.1,
      groupCount: 5,
      barsPerGroup: 2,
    });

    expect(dimensions.groupWidth).toBe(48);
    expect(dimensions.barWidth).toBe(21.6);
    expect(dimensions.gapWidth).toBeCloseTo(4.8);
  });

  it("respects an explicit zero custom bar width", () => {
    expect(
      getBarGroupDimensionsForAxis({
        axisStart: 20,
        axisEnd: 220,
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
});
