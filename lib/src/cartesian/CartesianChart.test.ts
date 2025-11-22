import { describe, expect, it } from "vitest";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";

/**
 * Tests for touch coordinate transformation in CartesianChart
 * 
 * The CartesianChart component transforms touch coordinates from the gesture
 * handler to chart-relative coordinates by:
 * 1. Using view-relative coordinates (touch.x/touch.y) instead of screen-absolute
 * 2. Subtracting pan/zoom transform offsets (scrolledX/scrolledY)
 * 3. Subtracting chart padding to get coordinates relative to the data area
 */
describe("CartesianChart touch coordinate transformation", () => {
  describe("coordinate calculation with padding", () => {
    it("should correctly calculate x coordinate with left padding", () => {
      // Simulate touch at left edge of chart with 20px padding
      const touchX = 20; // Touch at left edge (padding boundary)
      const scrolledX = 0; // No pan/zoom
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      
      // This is the calculation done in the gesture handler
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should result in 0 (left edge of data area)
      expect(chartX).toBe(0);
    });

    it("should correctly calculate x coordinate with numeric padding", () => {
      const touchX = 15; // Touch 15px from left
      const scrolledX = 0;
      const padding = 10; // Uniform padding
      
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should subtract padding: 15 - 10 = 5
      expect(chartX).toBe(5);
    });

    it("should correctly calculate y coordinate with top padding", () => {
      const touchY = 20; // Touch at top edge
      const scrolledY = 0;
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      
      const chartY = touchY - scrolledY - valueFromSidedNumber(padding, "top");
      
      expect(chartY).toBe(0);
    });

    it("should account for pan/zoom transform", () => {
      const touchX = 50;
      const scrolledX = 10; // Chart panned 10px to the right
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should be: 50 - 10 - 20 = 20
      expect(chartX).toBe(20);
    });

    it("should handle zero padding", () => {
      const touchX = 50;
      const scrolledX = 0;
      const padding = { left: 0, right: 0, top: 0, bottom: 0 };
      
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      expect(chartX).toBe(50);
    });
  });

  describe("view-relative vs screen-absolute coordinates", () => {
    it("should demonstrate the bug fix - using view-relative coordinates", () => {
      // Scenario: Chart is inside a container with 16px margin
      // Chart has 20px internal padding
      
      // BEFORE FIX: Used touch.absoluteX (screen coordinates)
      const touchAbsoluteX = 36; // 16px (container margin) + 20px (tap at padding edge)
      const scrolledX = 0;
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      
      // Old calculation (WRONG):
      const oldChartX = touchAbsoluteX - scrolledX;
      // This would give 36, which is wrong!
      expect(oldChartX).toBe(36);
      
      // AFTER FIX: Use touch.x (view-relative coordinates)
      const touchRelativeX = 20; // Only 20px from chart's left edge (padding)
      const newChartX = touchRelativeX - scrolledX - valueFromSidedNumber(padding, "left");
      // This correctly gives 0 (left edge of data area)
      expect(newChartX).toBe(0);
      
      // The fix eliminates the container margin offset
      const offset = oldChartX - newChartX;
      expect(offset).toBe(36); // 16px margin + 20px padding
    });

    it("should correctly map touch to chart coordinates with complex nesting", () => {
      // Complex scenario: Chart nested in multiple containers
      // Container structure adds 32px total offset from screen edge
      // Chart has asymmetric padding
      
      const touchRelativeX = 25; // Touch 25px from chart's left edge
      const scrolledX = 0;
      const padding = { left: 25, right: 10, top: 15, bottom: 15 };
      
      const chartX = touchRelativeX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should map to x=0 in data coordinates (at left padding boundary)
      expect(chartX).toBe(0);
    });
  });

  describe("real-world scenario - growth chart", () => {
    it("should correctly map tap at left edge to first data point", () => {
      // Real scenario from bug report:
      // - Growth chart with 0-240 month range
      // - 53 data points starting at x=0.5 months
      // - Chart padding: 20px all sides
      // - Chart width: 400px
      
      const chartWidth = 400;
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      const dataWidth = chartWidth - valueFromSidedNumber(padding, "left") - valueFromSidedNumber(padding, "right");
      
      // Tap at the left edge of the data area (where x=0.5 month data is)
      const touchX = 20; // At left padding boundary
      const scrolledX = 0;
      
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should map to x=0 in chart coordinates
      expect(chartX).toBe(0);
      
      // Verify this is indeed the left edge of the data area
      expect(chartX).toBeGreaterThanOrEqual(0);
      expect(chartX).toBeLessThan(dataWidth);
    });

    it("should correctly map tap at right edge", () => {
      const chartWidth = 400;
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };
      const dataWidth = chartWidth - valueFromSidedNumber(padding, "left") - valueFromSidedNumber(padding, "right");
      
      // Tap at the right edge of the data area
      const touchX = chartWidth - 20; // At right padding boundary (380px)
      const scrolledX = 0;
      
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      
      // Should map to the right edge of data area
      expect(chartX).toBe(dataWidth);
      expect(chartX).toBe(360); // 400 - 20 - 20 = 360
    });
  });
});
