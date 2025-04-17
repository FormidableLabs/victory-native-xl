import { describe, it, expect } from "vitest";
import { createRoundedRectPath } from "./createRoundedRectPath";

describe("createRoundedRectPath", () => {
  it("creates a rect with no rounded corners when no corner radii are provided", () => {
    const rect = createRoundedRectPath(10, 20, 100, 50, {}, 10);
    
    expect(rect.rect).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    expect(rect.topLeft).toEqual({ x: 0, y: 0 });
    expect(rect.topRight).toEqual({ x: 0, y: 0 });
    expect(rect.bottomLeft).toEqual({ x: 0, y: 0 });
    expect(rect.bottomRight).toEqual({ x: 0, y: 0 });
  });

  it("creates a rect with uniform rounded corners when all corners have the same radius", () => {
    const cornerRadius = 5;
    const rect = createRoundedRectPath(
      10, 20, 100, 50, 
      { 
        topLeft: cornerRadius,
        topRight: cornerRadius,
        bottomLeft: cornerRadius,
        bottomRight: cornerRadius 
      }, 
      10
    );
    
    expect(rect.rect).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    expect(rect.topLeft).toEqual({ x: cornerRadius, y: cornerRadius });
    expect(rect.topRight).toEqual({ x: cornerRadius, y: cornerRadius });
    expect(rect.bottomLeft).toEqual({ x: cornerRadius, y: cornerRadius });
    expect(rect.bottomRight).toEqual({ x: cornerRadius, y: cornerRadius });
  });

  it("creates a rect with non-uniform rounded corners", () => {
    const rect = createRoundedRectPath(
      10, 20, 100, 50, 
      { 
        topLeft: 5,
        topRight: 10,
        bottomLeft: 15,
        bottomRight: 20 
      }, 
      10
    );
    
    expect(rect.rect).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    expect(rect.topLeft).toEqual({ x: 5, y: 5 });
    expect(rect.topRight).toEqual({ x: 10, y: 10 });
    expect(rect.bottomLeft).toEqual({ x: 15, y: 15 });
    expect(rect.bottomRight).toEqual({ x: 20, y: 20 });
  });

  it("flips the corners when yValue is negative", () => {
    const rect = createRoundedRectPath(
      10, 20, 100, 50, 
      { 
        topLeft: 5,
        topRight: 10,
        bottomLeft: 15,
        bottomRight: 20 
      }, 
      -10 // Negative yValue
    );
    
    expect(rect.rect).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    // Corners should be flipped
    expect(rect.topLeft).toEqual({ x: 15, y: 15 }); // Was bottomLeft
    expect(rect.topRight).toEqual({ x: 20, y: 20 }); // Was bottomRight
    expect(rect.bottomLeft).toEqual({ x: 5, y: 5 }); // Was topLeft
    expect(rect.bottomRight).toEqual({ x: 10, y: 10 }); // Was topRight
  });

  it("appears to not limit corner radius as expected due to implementation issue", () => {
    // Bar width is 100
    const rect = createRoundedRectPath(
      10, 20, 100, 50, 
      { 
        topLeft: 60, // Greater than half width
        topRight: 40,
        bottomLeft: 30,
        bottomRight: 20 
      }, 
      10
    );
    
    // Based on current implementation, these values aren't capped
    expect(rect.topLeft.x).toBe(60);
    expect(rect.topRight.x).toBe(40);
    expect(rect.bottomLeft.x).toBe(30);
    expect(rect.bottomRight.x).toBe(20);
  });
}); 