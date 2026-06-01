import { describe, expect, it, vi } from "vitest";
import { applyPanTransformGestureConfig } from "./applyPanTransformGestureConfig";

const createPanGesture = () => ({
  activateAfterLongPress: vi.fn(),
  activeOffsetX: vi.fn(),
  activeOffsetY: vi.fn(),
  failOffsetX: vi.fn(),
  failOffsetY: vi.fn(),
});

describe("applyPanTransformGestureConfig", () => {
  it("wires each transformConfig pan option to the matching gesture method", () => {
    const panGesture = createPanGesture();

    applyPanTransformGestureConfig({
      panGesture,
      panConfig: {
        activateAfterLongPress: 75,
        activeOffsetX: [-20, 20],
        activeOffsetY: [-8, 8],
        failOffsetX: [-60, 60],
        failOffsetY: [-12, 12],
      },
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(75);
    expect(panGesture.activeOffsetX).toHaveBeenCalledWith([-20, 20]);
    expect(panGesture.activeOffsetY).toHaveBeenCalledWith([-8, 8]);
    expect(panGesture.failOffsetX).toHaveBeenCalledWith([-60, 60]);
    expect(panGesture.failOffsetY).toHaveBeenCalledWith([-12, 12]);
  });

  it("applies explicit zero values", () => {
    const panGesture = createPanGesture();

    applyPanTransformGestureConfig({
      panGesture,
      panConfig: {
        activateAfterLongPress: 0,
        activeOffsetX: 0,
        activeOffsetY: 0,
        failOffsetX: 0,
        failOffsetY: 0,
      },
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(0);
    expect(panGesture.activeOffsetX).toHaveBeenCalledWith(0);
    expect(panGesture.activeOffsetY).toHaveBeenCalledWith(0);
    expect(panGesture.failOffsetX).toHaveBeenCalledWith(0);
    expect(panGesture.failOffsetY).toHaveBeenCalledWith(0);
  });

  it("leaves omitted options unset", () => {
    const panGesture = createPanGesture();

    applyPanTransformGestureConfig({
      panGesture,
      panConfig: {
        dimensions: "x",
      },
    });

    expect(panGesture.activateAfterLongPress).not.toHaveBeenCalled();
    expect(panGesture.activeOffsetX).not.toHaveBeenCalled();
    expect(panGesture.activeOffsetY).not.toHaveBeenCalled();
    expect(panGesture.failOffsetX).not.toHaveBeenCalled();
    expect(panGesture.failOffsetY).not.toHaveBeenCalled();
  });
});
