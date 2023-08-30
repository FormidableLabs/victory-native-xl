import { describe, expect, it } from "vitest";
import { createRoundedRectPath } from "./createRoundedRectPath";

describe("createRoundedRectPath", () => {
  it("should create a basic rectangle without rounded corners", () => {
    const path = createRoundedRectPath(10, 10, 100, 50, {});
    expect(path).toBe(
      "M 10, 10 H 110 Q 110, 10, 110, 10 V 60 Q 110, 60, 110, 60 H 10 Q 10, 60, 10, 60 V 10 Q 10, 10, 10, 10 Z",
    );
  });

  it("should create a rectangle with equally rounded corners", () => {
    const path = createRoundedRectPath(10, 10, 100, 50, {
      topLeft: 10,
      topRight: 10,
      bottomLeft: 10,
      bottomRight: 10,
    });
    expect(path).toBe(
      "M 20, 10 H 100 Q 110, 10, 110, 20 V 50 Q 110, 60, 100, 60 H 20 Q 10, 60, 10, 50 V 20 Q 10, 10, 20, 10 Z",
    );
  });

  it("should clamp corner radii that exceed half the width", () => {
    const path = createRoundedRectPath(10, 10, 20, 50, {
      topLeft: 15,
      topRight: 15,
      bottomLeft: 15,
      bottomRight: 15,
    });
    /**
     * Without clamp the SVG string would be:
     * M 25, 10 H 15 Q 30, 10, 30, 25 V 45 Q 30, 60, 15, 60 H 25 Q 10, 60, 10, 45 V 25 Q 10, 10, 25, 10 Z
     */
    expect(path).toBe(
      "M 20, 10 H 20 Q 30, 10, 30, 20 V 50 Q 30, 60, 20, 60 H 20 Q 10, 60, 10, 50 V 20 Q 10, 10, 20, 10 Z",
    );
  });
});
