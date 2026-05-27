import { describe, expect, it } from "vitest";
import { computePieLayout } from "./computePieLayout";

describe("computePieLayout", () => {
  it("uses canvas dimensions for layout and centers in the canvas", () => {
    const { centerX, centerY, radius, layoutWidth, layoutHeight } =
      computePieLayout({
        canvasSize: { width: 200, height: 100 },
      });

    expect(layoutWidth).toBe(200);
    expect(layoutHeight).toBe(100);
    expect(radius).toBe(50);
    expect(centerX).toBe(100);
    expect(centerY).toBe(50);
  });

  it("uses size override for layout while keeping the pie centered in the canvas", () => {
    const { centerX, centerY, radius, layoutWidth, layoutHeight } =
      computePieLayout({
        canvasSize: { width: 200, height: 200 },
        size: 100,
      });

    expect(layoutWidth).toBe(100);
    expect(layoutHeight).toBe(100);
    expect(radius).toBe(50);
    expect(centerX).toBe(100);
    expect(centerY).toBe(100);
  });

  it("uses the smaller layout dimension for radius on non-square canvases", () => {
    const { radius } = computePieLayout({
      canvasSize: { width: 300, height: 150 },
    });

    expect(radius).toBe(75);
  });
});
