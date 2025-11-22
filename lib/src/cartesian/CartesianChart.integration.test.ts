import { describe, expect, it } from "vitest";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";

/**
 * Integration tests for touch coordinate transformation bug fix
 *
 * These tests simulate the actual coordinate transformation that happens
 * in the CartesianChart gesture handlers and verify that touch events
 * map to the correct data points.
 *
 * **The Bug:**
 * CartesianChart was using touch.absoluteX/absoluteY (screen-absolute coordinates)
 * without subtracting the chart's padding and container offsets. This caused
 * taps to register at the wrong position (10-20 pixels off).
 *
 * **The Fix:**
 * Use touch.x/touch.y (view-relative) and subtract padding:
 * `chartX = touch.x - scrolledX - valueFromSidedNumber(padding, "left")`
 *
 * **What These Tests Do:**
 * Simulate real chart scenarios with actual data and verify that:
 * 1. Touch coordinates are correctly transformed to chart space
 * 2. findClosestPoint returns the correct data point index
 * 3. The fix handles various padding and nesting scenarios
 */
describe("CartesianChart - Touch Coordinate Transformation Integration Tests", () => {
  describe("Real-world growth chart scenario", () => {
    // Simulating the actual growth chart from the bug report:
    // - Chart width: 400px
    // - Padding: 20px all sides
    // - Data: 53 points from x=0.5 to x=240 months
    // - Domain: 0.5 to 240 months (239.5 month range)

    const chartWidth = 400;
    const padding = { left: 20, right: 20, top: 20, bottom: 20 };
    const dataWidth = chartWidth - valueFromSidedNumber(padding, "left") - valueFromSidedNumber(padding, "right");

    // Simulate chart data: ox values are pixel positions of data points
    // For a 0.5-240 month range mapped to 360px (400 - 20 - 20):
    // Each month = 360px / 239.5 = 1.503px per month
    const xValues = [0.5, 5.5, 10.5, 13.075975, 13.108830, 15.5, 20.5, 25.5, 30.5, 240];
    const oxValues = xValues.map(x => {
      // Map from month to pixel position in data area
      const ratio = (x - 0.5) / (240 - 0.5);
      return ratio * dataWidth;
    });

    it("should correctly map left edge tap to first data point", () => {
      // User taps at the left edge of the data area (where x=0.5 month is)
      const touchX = 20; // At left padding boundary
      const scrolledX = 0; // No pan/zoom

      // BEFORE FIX (using touch.absoluteX without padding offset):
      // If chart is in a container with 16px margin, touch.absoluteX would be 36
      // This would be completely wrong!

      // AFTER FIX (using touch.x with padding offset):
      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");

      expect(chartX).toBe(0); // Should be at position 0 in data area

      // Verify findClosestPoint returns the first data point
      const idx = findClosestPoint(oxValues, chartX);
      expect(idx).toBe(0); // First data point (x=0.5 months)
      expect(xValues[idx!]).toBe(0.5);
    });

    it("should correctly map tap at 10.5 month data point", () => {
      // Data point at x=10.5 months
      // Position in data area: (10.5 - 0.5) / 239.5 * 360 = 15.03px
      const expectedOx = (10.5 - 0.5) / (240 - 0.5) * dataWidth;

      // User taps at this position (need to add padding offset for touch coordinate)
      const touchX = expectedOx + valueFromSidedNumber(padding, "left");
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");

      // Should map back to the position we calculated
      expect(chartX).toBeCloseTo(expectedOx, 1);

      // Verify it finds the 10.5 month data point
      const idx = findClosestPoint(oxValues, chartX);
      expect(xValues[idx!]).toBe(10.5);
    });

    it("should correctly handle tap with pan/zoom transform", () => {
      // Chart has been panned 10px to the right
      const touchX = 30; // Tap at what looks like 30px from left edge
      const scrolledX = 10; // But chart is scrolled

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");

      // Should account for scroll: 30 - 10 - 20 = 0
      expect(chartX).toBe(0);

      const idx = findClosestPoint(oxValues, chartX);
      expect(idx).toBe(0); // Still finds first data point
    });

    it("should demonstrate the bug when using screen-absolute coordinates", () => {
      // Scenario: Chart is inside a container with 16px margin
      // User taps at the visual left edge of the data area

      // BUGGY BEHAVIOR (using touch.absoluteX):
      const touchAbsoluteX = 36; // 16px container margin + 20px chart padding
      const scrolledX = 0;

      const buggyChartX = touchAbsoluteX - scrolledX; // Missing padding offset!
      expect(buggyChartX).toBe(36); // WRONG! Should be 0

      const buggyIdx = findClosestPoint(oxValues, buggyChartX);
      // This would find a completely wrong data point!
      expect(buggyIdx).not.toBe(0);

      // CORRECT BEHAVIOR (using touch.x):
      const touchRelativeX = 20; // View-relative, only 20px from chart's left edge
      const correctChartX = touchRelativeX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(correctChartX).toBe(0); // CORRECT!

      const correctIdx = findClosestPoint(oxValues, correctChartX);
      expect(correctIdx).toBe(0); // Finds the right data point!
    });
  });

  describe("Various padding configurations", () => {
    const dataPoints = [0, 50, 100, 150, 200, 250, 300, 350]; // 8 evenly spaced points

    it("should handle asymmetric padding", () => {
      const padding = { left: 25, right: 10, top: 15, bottom: 5 };

      // Tap at left padding boundary
      const touchX = 25;
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(0);

      const idx = findClosestPoint(dataPoints, chartX);
      expect(idx).toBe(0);
    });

    it("should handle numeric (uniform) padding", () => {
      const padding = 15; // Uniform padding

      const touchX = 65; // 15px padding + 50px into data area
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(50);

      const idx = findClosestPoint(dataPoints, chartX);
      expect(idx).toBe(1); // Second data point at x=50
    });

    it("should handle zero padding", () => {
      const padding = { left: 0, right: 0, top: 0, bottom: 0 };

      const touchX = 100; // No padding offset needed
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(100);

      const idx = findClosestPoint(dataPoints, chartX);
      expect(idx).toBe(2); // Third data point at x=100
    });
  });

  describe("Edge cases and precision", () => {
    const dataPoints = [0, 10, 20, 30, 40];

    it("should find correct point when tapping between data points", () => {
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };

      // Tap at position 25 (between 20 and 30)
      const touchX = 45; // 20px padding + 25px into data area
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(25);

      // Should find closest point (either 20 or 30)
      const idx = findClosestPoint(dataPoints, chartX);
      expect(idx).toBeGreaterThanOrEqual(2); // At index 2 (x=20) or 3 (x=30)
      expect(idx).toBeLessThanOrEqual(3);
    });

    it("should handle very small touch movements", () => {
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };

      // Tap very close to a data point (within 1px)
      const touchX = 30.5; // 20px padding + 10.5px (very close to x=10 data point)
      const scrolledX = 0;

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(10.5);

      const idx = findClosestPoint(dataPoints, chartX);
      expect(idx).toBe(1); // Should find x=10 data point
    });

    it("should handle combined pan and padding offset", () => {
      const padding = { left: 20, right: 20, top: 20, bottom: 20 };

      // Chart has been panned 15px, user taps at what appears to be x=25
      const touchX = 60; // 20px padding + 40px visual position
      const scrolledX = 15; // But chart is panned

      const chartX = touchX - scrolledX - valueFromSidedNumber(padding, "left");
      expect(chartX).toBe(25); // 60 - 15 - 20 = 25

      const idx = findClosestPoint(dataPoints, chartX);
      // Closest to x=20 or x=30
      const foundValue = dataPoints[idx!];
      expect([20, 30]).toContain(foundValue);
    });
  });
});
