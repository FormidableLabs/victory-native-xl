import { describe, expect, it, vi } from "vitest";
import { applyChartPressPanConfig } from "./applyChartPressPanConfig";

const createPanGesture = () => ({
  activateAfterLongPress: vi.fn(),
  activeOffsetX: vi.fn(),
  activeOffsetY: vi.fn(),
  failOffsetX: vi.fn(),
  failOffsetY: vi.fn(),
});

describe("applyChartPressPanConfig", () => {
  it("uses the default long-press delay when no pan config is provided", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 150,
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(150);
    expect(panGesture.activeOffsetX).not.toHaveBeenCalled();
    expect(panGesture.activeOffsetY).not.toHaveBeenCalled();
    expect(panGesture.failOffsetX).not.toHaveBeenCalled();
    expect(panGesture.failOffsetY).not.toHaveBeenCalled();
  });

  it("wires each chartPressConfig pan option to the matching gesture method", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 150,
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
});
