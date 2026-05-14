import { describe, expect, it, vi } from "vitest";
import type { AxisProps } from "../../types";
import { buildChartAxis } from "./useBuildChartAxis";

vi.mock("react-native", () => ({
  StyleSheet: {
    hairlineWidth: 1,
  },
}));

type Datum = {
  day: number;
  sales: number;
};

const legacyAxisOptions = {
  axisSide: { x: "bottom", y: "right" },
  tickCount: { x: 4, y: 3 },
  tickValues: { x: [0, 1], y: [10, 20] },
  labelPosition: { x: "inset", y: "outset" },
  labelOffset: { x: 5, y: 6 },
  labelColor: { x: "#111111", y: "#222222" },
  lineWidth: { grid: { x: 1, y: 2 }, frame: 3 },
  lineColor: { grid: { x: "#333333", y: "#444444" }, frame: "#555555" },
  domain: [0, 100],
} satisfies Partial<
  Omit<AxisProps<Datum, "day", "sales">, "xScale" | "yScale">
>;

describe("buildChartAxis", () => {
  it("normalizes legacy axisOptions into x, y, and frame props", () => {
    const normalized = buildChartAxis<Datum, "day", "sales">({
      axisOptions: legacyAxisOptions,
      yKeys: ["sales"],
    });

    expect(normalized.xAxis).toMatchObject({
      axisSide: "bottom",
      yAxisSide: "right",
      tickCount: 4,
      tickValues: [0, 1],
      labelPosition: "inset",
      labelOffset: 5,
      labelColor: "#111111",
      lineWidth: 1,
      lineColor: "#333333",
    });
    expect(normalized.yAxes[0]).toMatchObject({
      axisSide: "right",
      tickCount: 3,
      tickValues: [10, 20],
      labelPosition: "outset",
      labelOffset: 6,
      labelColor: "#222222",
      lineWidth: 2,
      lineColor: "#444444",
      yKeys: ["sales"],
      domain: [0, 100],
    });
    expect(normalized.frame).toEqual({
      lineColor: "#555555",
      lineWidth: 3,
    });
  });

  it("prefers explicit frame props over legacy axisOptions frame props", () => {
    const normalized = buildChartAxis<Datum, "day", "sales">({
      axisOptions: legacyAxisOptions,
      frame: { lineColor: "#abcdef", lineWidth: 8 },
      yKeys: ["sales"],
    });

    expect(normalized.frame).toEqual({
      lineColor: "#abcdef",
      lineWidth: 8,
    });
  });
});
