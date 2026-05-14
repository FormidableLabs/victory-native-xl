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
  it("uses the legacy long-press delay when pan config is omitted", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      panConfig: undefined,
      gestureLongPressDelay: 200,
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(200);
    expect(panGesture.activeOffsetX).not.toHaveBeenCalled();
    expect(panGesture.activeOffsetY).not.toHaveBeenCalled();
    expect(panGesture.failOffsetX).not.toHaveBeenCalled();
    expect(panGesture.failOffsetY).not.toHaveBeenCalled();
  });

  it("wires each chartPressConfig pan option to the matching gesture method", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      panConfig: {
        activateAfterLongPress: 250,
        activeOffsetX: [-12, 12],
        activeOffsetY: [-8, 8],
        failOffsetX: [-30, 30],
        failOffsetY: [-24, 24],
      },
      gestureLongPressDelay: 100,
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(250);
    expect(panGesture.activeOffsetX).toHaveBeenCalledWith([-12, 12]);
    expect(panGesture.activeOffsetY).toHaveBeenCalledWith([-8, 8]);
    expect(panGesture.failOffsetX).toHaveBeenCalledWith([-30, 30]);
    expect(panGesture.failOffsetY).toHaveBeenCalledWith([-24, 24]);
  });

  it("applies explicit zero values", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      panConfig: {
        activateAfterLongPress: 0,
        activeOffsetX: 0,
        activeOffsetY: 0,
        failOffsetX: 0,
        failOffsetY: 0,
      },
      gestureLongPressDelay: 100,
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(0);
    expect(panGesture.activeOffsetX).toHaveBeenCalledWith(0);
    expect(panGesture.activeOffsetY).toHaveBeenCalledWith(0);
    expect(panGesture.failOffsetX).toHaveBeenCalledWith(0);
    expect(panGesture.failOffsetY).toHaveBeenCalledWith(0);
  });

  it("does not apply the legacy long-press delay when pan config is provided", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      panConfig: {},
      gestureLongPressDelay: 100,
    });

    expect(panGesture.activateAfterLongPress).not.toHaveBeenCalled();
  });
});
