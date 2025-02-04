import { describe, expect, it } from "vitest";
import { normalizeYAxisTicks } from "./normalizeYAxisTicks";
import { makeScale } from "../cartesian/utils/makeScale";

describe("normalizeYAxisTicks", () => {
  it("maps secondary y-axis ticks to align with primary y-axis positions", () => {
    // Primary scale: 0-100 maps to 0-500 (output)
    const primaryScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [0, 500],
    });

    // Secondary scale: 0-1000 maps to 0-500 (output)
    const secondaryScale = makeScale({
      inputBounds: [0, 1000],
      outputBounds: [0, 500],
    });

    const primaryTicks = [0, 25, 50, 75, 100];
    const normalizedTicks = normalizeYAxisTicks(
      primaryTicks,
      primaryScale,
      secondaryScale,
    );

    // Each tick should map to the same output position
    expect(normalizedTicks).toEqual([0, 250, 500, 750, 1000]);

    // Verify alignment by checking output positions
    primaryTicks.forEach((tick, i) => {
      expect(primaryScale(tick)).toBeCloseTo(
        secondaryScale(normalizedTicks[i]!),
      );
    });
  });

  it("handles inverted scales", () => {
    // Primary scale: 0-100 maps to 500-0 (inverted output)
    const primaryScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [500, 0],
    });

    // Secondary scale: 0-1000 maps to 500-0 (inverted output)
    const secondaryScale = makeScale({
      inputBounds: [0, 1000],
      outputBounds: [500, 0],
    });

    const primaryTicks = [0, 50, 100];
    const normalizedTicks = normalizeYAxisTicks(
      primaryTicks,
      primaryScale,
      secondaryScale,
    );

    expect(normalizedTicks).toEqual([0, 500, 1000]);

    // Verify alignment by checking output positions
    primaryTicks.forEach((tick, i) => {
      expect(primaryScale(tick)).toBeCloseTo(
        secondaryScale(normalizedTicks[i]!),
      );
    });
  });

  it("handles negative ranges", () => {
    const primaryScale = makeScale({
      inputBounds: [-50, 50],
      outputBounds: [0, 500],
    });

    const secondaryScale = makeScale({
      inputBounds: [-500, 500],
      outputBounds: [0, 500],
    });

    const primaryTicks = [-50, 0, 50];
    const normalizedTicks = normalizeYAxisTicks(
      primaryTicks,
      primaryScale,
      secondaryScale,
    );

    expect(normalizedTicks).toEqual([-500, 0, 500]);

    // Verify alignment by checking output positions
    primaryTicks.forEach((tick, i) => {
      expect(primaryScale(tick)).toBeCloseTo(
        secondaryScale(normalizedTicks[i]!),
      );
    });
  });
});
