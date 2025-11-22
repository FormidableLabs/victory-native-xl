import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Regression tests for touch coordinate transformation bug fix
 *
 * These tests verify that the coordinate offset bug fix is present in the source code.
 *
 * **The Bug:**
 * CartesianChart was using touch.absoluteX/absoluteY (screen-absolute coordinates)
 * instead of touch.x/touch.y (view-relative coordinates), and wasn't subtracting
 * the chart's padding offset. This caused taps to register 10-20 pixels off from
 * their actual position when the chart was inside containers with margins/padding.
 *
 * **The Fix:**
 * Changed all gesture handlers to use:
 * - `touch.x - scrolledX - valueFromSidedNumber(padding, "left")`
 * - `touch.y - scrolledY - valueFromSidedNumber(padding, "top")`
 *
 * These tests ensure the fix doesn't regress by verifying the correct code is present.
 */
describe("CartesianChart - Touch Coordinate Transformation Bug Fix", () => {
  const sourceCode = readFileSync(
    join(__dirname, "CartesianChart.tsx"),
    "utf-8"
  );

  describe("uses view-relative coordinates (not screen-absolute)", () => {
    it("should NOT use touch.absoluteX (the bug)", () => {
      expect(sourceCode).not.toContain("touch.absoluteX");
    });

    it("should NOT use touch.absoluteY (the bug)", () => {
      expect(sourceCode).not.toContain("touch.absoluteY");
    });

    it("should use touch.x (the fix)", () => {
      // Should appear in gesture handlers
      expect(sourceCode).toContain("touch.x");
    });

    it("should use touch.y (the fix)", () => {
      expect(sourceCode).toContain("touch.y");
    });
  });

  describe("subtracts chart padding offset", () => {
    it("should subtract left padding from x coordinate", () => {
      expect(sourceCode).toContain('valueFromSidedNumber(padding, "left")');
    });

    it("should subtract top padding from y coordinate", () => {
      expect(sourceCode).toContain('valueFromSidedNumber(padding, "top")');
    });

    it("should apply full x transformation: touch.x - scrolledX - padding.left", () => {
      // Match the exact transformation formula
      const xPattern = /touch\.x\s*-\s*scrolledX\s*-\s*valueFromSidedNumber\(padding,\s*"left"\)/;
      const matches = sourceCode.match(new RegExp(xPattern, "g"));

      // Should appear in 3 gesture handlers: onTouchesDown, onStart, onTouchesMove
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(3);
    });

    it("should apply full y transformation: touch.y - scrolledY - padding.top", () => {
      const yPattern = /touch\.y\s*-\s*scrolledY\s*-\s*valueFromSidedNumber\(padding,\s*"top"\)/;
      const matches = sourceCode.match(new RegExp(yPattern, "g"));

      // Should appear in 3 gesture handlers: onTouchesDown, onStart, onTouchesMove
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("applies transformation in all gesture handlers", () => {
    it("should transform coordinates in .onTouchesDown()", () => {
      // Find the onTouchesDown handler
      const onTouchesDown = sourceCode.match(
        /\.onTouchesDown\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]{1,2000}?\}\s*\)/
      );

      expect(onTouchesDown).toBeTruthy();

      const handler = onTouchesDown![0];
      expect(handler).toContain('touch.x - scrolledX - valueFromSidedNumber(padding, "left")');
      expect(handler).toContain('touch.y - scrolledY - valueFromSidedNumber(padding, "top")');
    });

    it("should transform coordinates in .onStart()", () => {
      const onStart = sourceCode.match(
        /\.onStart\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]{1,2000}?\}\s*\)/
      );

      expect(onStart).toBeTruthy();

      const handler = onStart![0];
      expect(handler).toContain('touch.x - scrolledX - valueFromSidedNumber(padding, "left")');
      expect(handler).toContain('touch.y - scrolledY - valueFromSidedNumber(padding, "top")');
    });

    it("should transform coordinates in .onTouchesMove()", () => {
      const onTouchesMove = sourceCode.match(
        /\.onTouchesMove\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]{1,1000}?\}\s*\)/
      );

      expect(onTouchesMove).toBeTruthy();

      const handler = onTouchesMove![0];
      expect(handler).toContain('touch.x - scrolledX - valueFromSidedNumber(padding, "left")');
      expect(handler).toContain('touch.y - scrolledY - valueFromSidedNumber(padding, "top")');
    });
  });

  describe("handleTouch receives transformed coordinates", () => {
    it("should pass transformed x coordinate to handleTouch", () => {
      // handleTouch should be called with the transformed coordinates as arguments
      const handleTouchCalls = sourceCode.match(
        /handleTouch\s*\(\s*v\s*,\s*touch\.x\s*-\s*scrolledX\s*-\s*valueFromSidedNumber\(padding,\s*"left"\)/g
      );

      expect(handleTouchCalls).toBeTruthy();
      expect(handleTouchCalls!.length).toBeGreaterThanOrEqual(3);
    });

    it("should pass transformed y coordinate to handleTouch", () => {
      const handleTouchCalls = sourceCode.match(
        /touch\.y\s*-\s*scrolledY\s*-\s*valueFromSidedNumber\(padding,\s*"top"\)\s*,?\s*\)/g
      );

      expect(handleTouchCalls).toBeTruthy();
      expect(handleTouchCalls!.length).toBeGreaterThanOrEqual(3);
    });
  });
});
