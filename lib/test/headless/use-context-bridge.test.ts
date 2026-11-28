import { createContext, createElement, type ReactNode } from "react";
import { Skia } from "react-native-skia";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CapturesBridge,
  ContextReader,
  PausesRendering,
} from "./fixtures/pausedRendererProbe";
import { createHostRoot } from "./utils/renderInHost";
import { SkiaSGRoot } from "./utils/skiaRoot";

const MULTIPLE_RENDERERS = "Detected multiple renderers";

type Bridge = (content: ReactNode) => ReactNode;

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Renders an app whose renderer pauses below a provider of `context`, and
 * updates a canvas during that pause with what `makeCanvasContent` returns.
 * This is how a canvas ends up rendering while the app's renderer is still
 * below a provider of a context that the canvas provides too.
 */
const renderCanvasWhileAppIsPaused = async (
  context: React.Context<string>,
  appContent: (onBridge: (bridge: Bridge) => void) => ReactNode,
  makeCanvasContent: (
    bridge: Bridge | undefined,
    reader: ReactNode,
  ) => ReactNode,
) => {
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  const onValue = vi.fn();
  const canvas = new SkiaSGRoot(Skia);
  let bridge: Bridge | undefined;
  let canvasUpdate: Promise<void> | undefined;

  const whilePaused = () => {
    canvasUpdate ??= canvas.render(
      makeCanvasContent(
        bridge,
        createElement(ContextReader, { context, onValue }),
      ),
    );
  };

  const root = createHostRoot();
  await root.renderInBackground(
    createElement(
      context.Provider,
      { value: "from the app" },
      appContent((value) => {
        bridge = value;
      }),
      createElement(PausesRendering, { whilePaused }),
      // More work after the pause, so that the render is not over yet.
      createElement(PausesRendering, { whilePaused }),
    ),
  );
  await canvasUpdate;
  await root.unmount();
  await canvas.unmount();

  return {
    onValue,
    reports: errors.mock.calls.filter(([message]) =>
      String(message).includes(MULTIPLE_RENDERERS),
    ),
  };
};

describe("useContextBridge", () => {
  it("is reported by React when a context is provided again by hand", async () => {
    // Shows that the scenario is the one React complains about.
    const HandProvided = createContext("default");
    const { onValue, reports } = await renderCanvasWhileAppIsPaused(
      HandProvided,
      () => null,
      (_bridge, reader) =>
        createElement(HandProvided.Provider, { value: "by hand" }, reader),
    );

    expect(onValue).toHaveBeenCalledWith("by hand");
    expect(reports.length).toBeGreaterThan(0);
  });

  it("is not reported by React when the context is bridged", async () => {
    const Bridged = createContext("default");
    const { onValue, reports } = await renderCanvasWhileAppIsPaused(
      Bridged,
      (onBridge) =>
        createElement(CapturesBridge, { context: Bridged, onBridge }),
      (bridge, reader) => bridge!(reader),
    );

    expect(onValue).toHaveBeenCalledWith("from the app");
    expect(reports).toHaveLength(0);
  });
});
