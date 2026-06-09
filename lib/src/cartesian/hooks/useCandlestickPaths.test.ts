import { describe, expect, it } from "vitest";
import { resolveCandlestickPathOptions } from "../utils/resolveCandlestickPathOptions";

describe("resolveCandlestickPathOptions", () => {
  it("falls back to status defaults when custom options provide undefined", () => {
    const resolved = resolveCandlestickPathOptions({
      color: "#26a69a",
      wickStrokeWidth: 2,
      options: {
        body: {
          color: undefined,
          opacity: 0.7,
        },
        wick: {
          color: undefined,
          strokeWidth: undefined,
          opacity: 0.5,
        },
      },
    });

    expect(resolved.bodyOptions).toEqual({
      color: "#26a69a",
      opacity: 0.7,
    });
    expect(resolved.wickOptions).toEqual({
      color: "#26a69a",
      strokeWidth: 2,
      opacity: 0.5,
    });
  });

  it("uses custom color and strokeWidth overrides when provided", () => {
    const resolved = resolveCandlestickPathOptions({
      color: "#26a69a",
      wickStrokeWidth: 2,
      options: {
        body: {
          color: "#f97316",
        },
        wick: {
          color: "#2563eb",
          strokeWidth: 4,
        },
      },
    });

    expect(resolved.bodyOptions.color).toBe("#f97316");
    expect(resolved.wickOptions.color).toBe("#2563eb");
    expect(resolved.wickOptions.strokeWidth).toBe(4);
  });
});
