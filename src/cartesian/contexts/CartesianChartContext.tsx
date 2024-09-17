import type { ScaleLinear } from "d3-scale";
import React, {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";

interface CartesianChartContext {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}

const CartesianChartContext = createContext<CartesianChartContext | undefined>(
  undefined,
);

interface CartesianChartProviderProps {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}

export const CartesianChartProvider = (
  props: PropsWithChildren<CartesianChartProviderProps>,
) => {
  const { children, xScale, yScale } = props;

  return (
    <CartesianChartContext.Provider
      value={{
        xScale,
        yScale,
      }}
    >
      {children}
    </CartesianChartContext.Provider>
  );
};

export const useCartesianChartContext = () => {
  const context = useContext(CartesianChartContext);

  if (context === undefined) {
    throw new Error(
      "useCartesianChartContext must be used within a CartesianChartProvider",
    );
  }

  return context;
};
