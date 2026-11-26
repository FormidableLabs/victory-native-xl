import React from "react";
import {
  CartesianChart,
  Pie,
  PolarChart,
  useCartesianChartContext,
  useCartesianTransformContext,
  type CartesianChartContextValue,
  type CartesianTransformContextValue,
} from "victory-native";

export const ThemeContext = React.createContext("default theme");
export const LocaleContext = React.createContext("default locale");

/**
 * What the components rendered inside the canvas observed.
 */
export type Observations = {
  renders: number;
  theme?: string;
  locale?: string;
  chart?: CartesianChartContextValue;
  transform?: CartesianTransformContextValue;
};

export const makeObservations = (): Observations => ({ renders: 0 });

const AppContextProbe = ({ seen }: { seen: Observations }) => {
  seen.renders += 1;
  seen.theme = React.useContext(ThemeContext);
  seen.locale = React.useContext(LocaleContext);
  return null;
};

const CartesianContextProbe = ({ seen }: { seen: Observations }) => {
  seen.chart = useCartesianChartContext();
  seen.transform = useCartesianTransformContext();
  return null;
};

const CARTESIAN_DATA = [
  { x: 1, y: 40 },
  { x: 2, y: 80 },
];

const POLAR_DATA = [
  { label: "a", value: 30, color: "#E45756" },
  { label: "b", value: 70, color: "#4C78A8" },
];

const SIZE = { width: 200, height: 120 };

type ChartFixtureProps = {
  seen: Observations;
  contexts?: React.ComponentProps<typeof PolarChart>["contexts"];
};

/**
 * Not headless: the chart mounts its own canvas, as it does in an app.
 */
export const CartesianFixture = ({ seen, contexts }: ChartFixtureProps) => (
  <CartesianChart
    data={CARTESIAN_DATA}
    xKey="x"
    yKeys={["y"]}
    explicitSize={SIZE}
    contexts={contexts}
    renderOutside={() => <CartesianContextProbe seen={seen} />}
  >
    {() => <AppContextProbe seen={seen} />}
  </CartesianChart>
);

export const PolarFixture = ({ seen, contexts }: ChartFixtureProps) => (
  <PolarChart
    data={POLAR_DATA}
    labelKey="label"
    valueKey="value"
    colorKey="color"
    explicitSize={SIZE}
    contexts={contexts}
  >
    <Pie.Chart />
    <AppContextProbe seen={seen} />
  </PolarChart>
);

/**
 * An app that provides two contexts above a chart. The chart element is
 * passed in, so that it keeps its identity when the app renders again with
 * new context values: only context can make the chart render again.
 */
export const App = ({
  theme,
  locale,
  children,
}: React.PropsWithChildren<{ theme: string; locale: string }>) => (
  <ThemeContext.Provider value={theme}>
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  </ThemeContext.Provider>
);
