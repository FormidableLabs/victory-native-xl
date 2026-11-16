import React, {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import type { SharedValue } from "react-native-reanimated";
import type { PieHoverState } from "../../types";

/** Chart-space pointer position while hovering (`null` otherwise). */
export type PolarHoverPointer = { x: number; y: number } | null;

interface PolarChartContext {
  data: Record<string, unknown>[];
  canvasSize: { width: number; height: number };
  labelKey: string;
  valueKey: string;
  colorKey: string;
  hoverPointer?: SharedValue<PolarHoverPointer>;
  chartHoverState: PieHoverState;
}

const PolarChartContext = createContext<PolarChartContext | undefined>(
  undefined,
);

interface PolarChartProviderProps {
  data: Record<string, unknown>[];
  canvasSize: { width: number; height: number };
  labelKey: string;
  valueKey: string;
  colorKey: string;
  hoverPointer?: SharedValue<PolarHoverPointer>;
  chartHoverState: PieHoverState;
}

export const PolarChartProvider = (
  props: PropsWithChildren<PolarChartProviderProps>,
) => {
  const {
    children,
    data,
    canvasSize,
    labelKey,
    valueKey,
    colorKey,
    hoverPointer,
    chartHoverState,
  } = props;

  return (
    <PolarChartContext.Provider
      value={{
        data,
        canvasSize,
        labelKey,
        valueKey,
        colorKey,
        hoverPointer,
        chartHoverState,
      }}
    >
      {children}
    </PolarChartContext.Provider>
  );
};

export const usePolarChartContext = () => {
  const context = useContext(PolarChartContext);

  if (context === undefined) {
    throw new Error(
      "usePolarChartContext must be used within a PolarChartProvider",
    );
  }

  return context;
};

/**
 * Hover state for pie and donut charts; `index` is the hovered slice, or `-1`
 * when none is hovered. `PolarChart` maintains this value (`chartHoverState`
 * only overrides it), so this hook works without passing the prop.
 */
export const usePieHoverState = (): PieHoverState => {
  const { chartHoverState } = usePolarChartContext();

  return chartHoverState;
};
