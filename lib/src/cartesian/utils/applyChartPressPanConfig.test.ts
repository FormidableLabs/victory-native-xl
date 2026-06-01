import { describe, expect, it, vi } from "vitest";
import { applyChartPressPanConfig } from "./applyChartPressPanConfig";

const createPanGesture = () => ({
  activateAfterLongPress: vi.fn(),
  activeOffsetX: vi.fn(),
  activeOffsetY: vi.fn(),
  failOffsetX: vi.fn(),
  failOffsetY: vi.fn(),
  simultaneousWithExternalGesture: vi.fn(),
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
    expect(panGesture.simultaneousWithExternalGesture).not.toHaveBeenCalled();
  });

  it("wires each chartPressConfig pan option to the matching gesture method", () => {
    const panGesture = createPanGesture();
    const scrollRef = { current: undefined };

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 150,
      panConfig: {
        activateAfterLongPress: 75,
        activeOffsetX: [-20, 20],
        activeOffsetY: [-8, 8],
        failOffsetX: [-60, 60],
        failOffsetY: [-12, 12],
        simultaneousWithExternalGesture: scrollRef,
      },
    });

    expect(panGesture.activateAfterLongPress).toHaveBeenCalledWith(75);
    expect(panGesture.activeOffsetX).toHaveBeenCalledWith([-20, 20]);
    expect(panGesture.activeOffsetY).toHaveBeenCalledWith([-8, 8]);
    expect(panGesture.failOffsetX).toHaveBeenCalledWith([-60, 60]);
    expect(panGesture.failOffsetY).toHaveBeenCalledWith([-12, 12]);
    expect(panGesture.simultaneousWithExternalGesture).toHaveBeenCalledWith(
      scrollRef,
    );
  });

  it("applies explicit zero values", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 100,
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

  it("applies multiple external simultaneous gestures", () => {
    const panGesture = createPanGesture();
    const scrollRef = { current: undefined };
    const sheetRef = { current: undefined };

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 100,
      panConfig: {
        simultaneousWithExternalGesture: [scrollRef, sheetRef],
      },
    });

    expect(panGesture.simultaneousWithExternalGesture).toHaveBeenCalledWith(
      scrollRef,
      sheetRef,
    );
  });

  it("does not apply the default long-press delay when pan config is provided", () => {
    const panGesture = createPanGesture();

    applyChartPressPanConfig({
      panGesture,
      gestureLongPressDelay: 100,
      panConfig: {},
    });

    expect(panGesture.activateAfterLongPress).not.toHaveBeenCalled();
  });
});
