import { describe, expect, it } from "vitest";
import { findClosestPoint } from "../../utils/findClosestPoint";
import { identity4, setScale, setTranslate } from "../../utils/transform";
import { getCartesianTouchCoordinates } from "./getCartesianTouchCoordinates";

describe("getCartesianTouchCoordinates", () => {
  it("uses handler-relative coordinates when the chart is not transformed", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: 30, y: 40, absoluteX: 128, absoluteY: 240 },
      }),
    ).toEqual({ x: 30, y: 40 });
  });

  it("keeps chart padding in the coordinate space passed to handleTouch", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: 20, y: 24, absoluteX: 148, absoluteY: 224 },
      }),
    ).toEqual({ x: 20, y: 24 });
  });

  it("uses visible chart coordinates when the viewport pushes data offscreen", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: 20, y: 40 },
      }),
    ).toEqual({ x: 20, y: 40 });
  });

  it("uses handler-relative coordinates for transformed charts", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: 72, y: 48, absoluteX: 280, absoluteY: 240 },
      }),
    ).toEqual({ x: 72, y: 48 });
  });

  it("does not double-apply zoom transforms to local coordinates", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: 96, y: 40, absoluteX: 220, absoluteY: 160 },
      }),
    ).toEqual({ x: 96, y: 40 });
  });

  it("inverts chart transforms when the gesture overlay stays fixed", () => {
    const transform = setTranslate(setScale(identity4, 2, 4), -60, 20);

    expect(
      getCartesianTouchCoordinates({
        touch: { x: 100, y: 220 },
        transform,
      }),
    ).toEqual({ x: 80, y: 50 });
  });

  it("falls back to unscaled coordinates for non-invertible transform scale", () => {
    const transform = setScale(identity4, 0, 0);

    expect(
      getCartesianTouchCoordinates({
        touch: { x: 100, y: 220 },
        transform,
      }),
    ).toEqual({ x: 100, y: 220 });
  });

  it("finds the intended data point when the chart is nested in an offset container", () => {
    const points = [20, 60, 100, 140];
    const touchPoint = getCartesianTouchCoordinates({
      touch: { x: 60, y: 40, absoluteX: 260, absoluteY: 320 },
    });

    expect(findClosestPoint(points, touchPoint.x)).toBe(1);
    expect(findClosestPoint(points, 260)).not.toBe(1);
  });

  it("finds the intended data point when the transformed handler is zoomed", () => {
    const points = [20, 60, 100, 140];
    const touchPoint = getCartesianTouchCoordinates({
      touch: { x: 60, y: 40, absoluteX: 120, absoluteY: 160 },
    });

    expect(findClosestPoint(points, touchPoint.x)).toBe(1);
    expect(findClosestPoint(points, 120)).not.toBe(1);
  });

  it("does not return NaN for invalid touch coordinates", () => {
    expect(
      getCartesianTouchCoordinates({
        touch: { x: Number.NaN, y: Number.NaN },
      }),
    ).toEqual({ x: 0, y: 0 });
  });
});
