import { describe, expect, it } from "vitest";
import { createRoundedRectPath } from "./createRoundedRectPath";

describe("createRoundedRectPath", () => {
  it("caps corner radii to half the bar width", () => {
    expect(
      createRoundedRectPath(
        10,
        20,
        8,
        40,
        {
          topLeft: 10,
          topRight: 6,
          bottomRight: 3,
          bottomLeft: 2,
        },
        12,
      ),
    ).toMatchObject({
      topLeft: { x: 4, y: 4 },
      topRight: { x: 4, y: 4 },
      bottomRight: { x: 3, y: 3 },
      bottomLeft: { x: 2, y: 2 },
    });
  });

  it("swaps top and bottom corner radii for negative bars", () => {
    expect(
      createRoundedRectPath(
        10,
        20,
        8,
        -40,
        {
          topLeft: 1,
          topRight: 2,
          bottomRight: 8,
          bottomLeft: 7,
        },
        -12,
      ),
    ).toMatchObject({
      topLeft: { x: 4, y: 4 },
      topRight: { x: 4, y: 4 },
      bottomRight: { x: 2, y: 2 },
      bottomLeft: { x: 1, y: 1 },
    });
  });

  it("swaps left and right corner radii for negative horizontal bars", () => {
    expect(
      createRoundedRectPath(
        10,
        20,
        40,
        8,
        {
          topLeft: 1,
          topRight: 8,
          bottomRight: 7,
          bottomLeft: 2,
        },
        -12,
        "horizontal",
      ),
    ).toMatchObject({
      topLeft: { x: 4, y: 4 },
      topRight: { x: 1, y: 1 },
      bottomRight: { x: 2, y: 2 },
      bottomLeft: { x: 4, y: 4 },
    });
  });
});
