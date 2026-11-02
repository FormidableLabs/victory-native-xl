import { describe, expect, it, vi } from "vitest";
import { applyChartHoverConfig } from "./applyChartHoverConfig";

const createHoverGesture = () => ({
  activeCursor: vi.fn(),
  simultaneousWithExternalGesture: vi.fn(),
});

describe("applyChartHoverConfig", () => {
  it("leaves the gesture untouched when no hover config is provided", () => {
    const hoverGesture = createHoverGesture();

    applyChartHoverConfig({ gesture: hoverGesture });

    expect(hoverGesture.activeCursor).not.toHaveBeenCalled();
    expect(hoverGesture.simultaneousWithExternalGesture).not.toHaveBeenCalled();
  });

  it("wires the activeCursor to the gesture", () => {
    const hoverGesture = createHoverGesture();

    applyChartHoverConfig({
      gesture: hoverGesture,
      hoverConfig: { activeCursor: "pointer" },
    });

    expect(hoverGesture.activeCursor).toHaveBeenCalledWith("pointer");
    expect(hoverGesture.simultaneousWithExternalGesture).not.toHaveBeenCalled();
  });

  it("wires a single external gesture", () => {
    const hoverGesture = createHoverGesture();
    const scrollRef = { current: undefined };

    applyChartHoverConfig({
      gesture: hoverGesture,
      hoverConfig: { simultaneousWithExternalGesture: scrollRef },
    });

    expect(hoverGesture.simultaneousWithExternalGesture).toHaveBeenCalledWith(
      scrollRef,
    );
    expect(hoverGesture.activeCursor).not.toHaveBeenCalled();
  });

  it("wires an array of external gestures", () => {
    const hoverGesture = createHoverGesture();
    const first = { current: undefined };
    const second = { current: undefined };

    applyChartHoverConfig({
      gesture: hoverGesture,
      hoverConfig: { simultaneousWithExternalGesture: [first, second] },
    });

    expect(hoverGesture.simultaneousWithExternalGesture).toHaveBeenCalledWith(
      first,
      second,
    );
  });
});
