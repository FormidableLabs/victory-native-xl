import { scaleLinear } from "d3-scale";
import { describe, expect, it } from "vitest";
import { createSafeZoomTransform } from "./createSafeZoomTransform";

describe("createSafeZoomTransform", () => {
  it("keeps zero scales from producing invalid rescaled domains", () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const transform = createSafeZoomTransform(0, 0, 0);
    const domain = transform.rescaleX(scale).domain();

    expect(domain).toEqual([0, 10]);
    expect(domain.every(Number.isFinite)).toBe(true);
  });

  it("preserves non-zero scales for d3 zoom rescaling", () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const transform = createSafeZoomTransform(2, 0, 0);

    expect(transform.rescaleX(scale).domain()).toEqual([0, 5]);
  });
});
