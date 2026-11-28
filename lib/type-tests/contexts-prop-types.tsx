import * as React from "react";
import { CartesianChart, PolarChart } from "victory-native";

const ThemeContext = React.createContext({ lineColor: "#000000" });
const LocaleContext = React.createContext<string | undefined>(undefined);

const CARTESIAN_DATA = [{ x: 1, y: 2 }];
const POLAR_DATA = [{ label: "a", value: 1, color: "#000000" }];

// Contexts of any value type can be listed together.
export const cartesianWithContexts = (
  <CartesianChart
    data={CARTESIAN_DATA}
    xKey="x"
    yKeys={["y"]}
    contexts={[ThemeContext, LocaleContext]}
  >
    {() => null}
  </CartesianChart>
);

export const polarWithContexts = (
  <PolarChart
    data={POLAR_DATA}
    labelKey="label"
    valueKey="value"
    colorKey="color"
    contexts={[ThemeContext, LocaleContext]}
  />
);

export const cartesianWithInvalidContexts = (
  <CartesianChart
    data={CARTESIAN_DATA}
    xKey="x"
    yKeys={["y"]}
    // @ts-expect-error contexts takes React contexts, not their values
    contexts={[{ lineColor: "#000000" }]}
  >
    {() => null}
  </CartesianChart>
);
