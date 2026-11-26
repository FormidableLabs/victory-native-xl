import React, {
  useContext,
  useMemo,
  createContext,
  type PropsWithChildren,
} from "react";

interface PolarChartContext {
  data: Record<string, unknown>[];
  canvasSize: { width: number; height: number };
  labelKey: string;
  valueKey: string;
  colorKey: string;
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
}

export const PolarChartProvider = (
  props: PropsWithChildren<PolarChartProviderProps>,
) => {
  const { children, data, canvasSize, labelKey, valueKey, colorKey } = props;
  const value = useMemo(
    () => ({ data, canvasSize, labelKey, valueKey, colorKey }),
    [data, canvasSize, labelKey, valueKey, colorKey],
  );

  return (
    <PolarChartContext.Provider value={value}>
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
