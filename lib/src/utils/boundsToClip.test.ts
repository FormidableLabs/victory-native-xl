import { describe, expect, it, vi } from "vitest";
import { boundsToClip } from "./boundsToClip";

// Mock the Skia rect function as vitest can't import RN Skia
vi.mock("@shopify/react-native-skia", () => ({
  rect: (x: number, y: number, width: number, height: number) => ({
    type: "rect",
    rect: [x, y, width, height],
  }),
}));

describe("boundsToClip", () => {
  it("converts chart bounds to a Skia rect clip definition", () => {
    const bounds = {
      left: 10,
      right: 110,
      top: 20,
      bottom: 120,
    };

    const clipDef = boundsToClip(bounds);

    // Skia rect takes (x, y, width, height)
    expect(clipDef).toEqual({
      rect: [10, 20, 100, 100], // width = right - left, height = bottom - top
      type: "rect",
    });
  });

  it("handles zero dimensions", () => {
    const bounds = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    const clipDef = boundsToClip(bounds);

    expect(clipDef).toEqual({
      rect: [0, 0, 0, 0],
      type: "rect",
    });
  });

  it("handles negative dimensions", () => {
    const bounds = {
      left: -10,
      right: -5,
      top: -20,
      bottom: -15,
    };

    const clipDef = boundsToClip(bounds);

    expect(clipDef).toEqual({
      rect: [-10, -20, 5, 5],
      type: "rect",
    });
  });
});
