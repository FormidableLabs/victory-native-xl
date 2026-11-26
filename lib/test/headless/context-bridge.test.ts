import { createElement, type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  App,
  CartesianFixture,
  LocaleContext,
  makeObservations,
  PolarFixture,
  ThemeContext,
  type Observations,
} from "./fixtures/contextBridgeCharts";
import { createHostRoot } from "./utils/renderInHost";
import { SkiaSGRoot } from "./utils/skiaRoot";

type Fixture = typeof CartesianFixture;

const CHARTS: [string, Fixture][] = [
  ["CartesianChart", CartesianFixture],
  ["PolarChart", PolarFixture],
];

const app = (theme: string, locale: string, chart: ReactElement) =>
  createElement(App, { theme, locale }, chart);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("contexts inside the canvas", () => {
  it("provides the chart's own contexts", async () => {
    const seen = makeObservations();
    const root = createHostRoot();
    await root.render(createElement(CartesianFixture, { seen }));

    expect(seen.chart?.orientation).toBe("vertical");
    expect(seen.chart?.xScale(1)).toBeTypeOf("number");
    expect(seen.transform).toEqual({ k: 1, kx: 1, ky: 1, tx: 0, ty: 0 });

    await root.unmount();
  });

  describe.each(CHARTS)("%s", (_name, Fixture) => {
    const mount = async (seen: Observations, contexts?: unknown) => {
      const root = createHostRoot();
      const chart = createElement(Fixture, {
        seen,
        contexts: contexts as never,
      });
      await root.render(app("dark", "fr", chart));
      return { root, chart };
    };

    it("does not forward the contexts of the app by default", async () => {
      const seen = makeObservations();
      const { root } = await mount(seen);

      expect(seen.renders).toBeGreaterThan(0);
      expect(seen.theme).toBe("default theme");
      expect(seen.locale).toBe("default locale");

      await root.unmount();
    });

    it("forwards the listed contexts, and their updates", async () => {
      const seen = makeObservations();
      const { root, chart } = await mount(seen, [ThemeContext]);

      expect(seen.theme).toBe("dark");
      expect(seen.locale).toBe("default locale");

      await root.render(app("light", "fr", chart));
      expect(seen.theme).toBe("light");

      await root.unmount();
    });

    it("leaves the canvas alone when another context changes", async () => {
      const seen = makeObservations();
      const { root, chart } = await mount(seen, [ThemeContext]);
      const canvasUpdates = vi.spyOn(SkiaSGRoot.prototype, "render");
      const renders = seen.renders;

      // Not bridged: the chart is not subscribed to it.
      await root.render(app("dark", "en", chart));
      expect(canvasUpdates).not.toHaveBeenCalled();
      expect(seen.renders).toBe(renders);

      // Bridged: the canvas gets the new value.
      await root.render(app("light", "en", chart));
      expect(canvasUpdates).toHaveBeenCalledTimes(1);
      expect(seen.renders).toBe(renders + 1);

      await root.unmount();
    });

    it("does not report bridged contexts as rendered by two renderers", async () => {
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      const seen = makeObservations();
      const { root } = await mount(seen, [ThemeContext, LocaleContext]);

      expect(seen.theme).toBe("dark");
      expect(seen.locale).toBe("fr");
      expect(errors).not.toHaveBeenCalled();

      await root.unmount();
    });
  });
});
