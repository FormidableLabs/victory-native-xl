import type { ScaleLinear } from "d3-scale";
import React, {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import type { CartesianChartOrientation } from "../../types";

export type CartesianChartContextValue = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  orientation: CartesianChartOrientation;
};

const CartesianChartContext = createContext<
  CartesianChartContextValue | undefined
>(undefined);

interface CartesianChartProviderProps {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  orientation?: CartesianChartOrientation;
}

export const CartesianChartProvider = (
  props: PropsWithChildren<CartesianChartProviderProps>,
) => {
  const { children, xScale, yScale, orientation = "vertical" } = props;

  return (
    <CartesianChartContext.Provider
      value={{
        xScale,
        yScale,
        orientation,
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
