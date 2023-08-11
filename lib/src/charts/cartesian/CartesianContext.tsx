import * as React from "react";
import { type SharedValue } from "react-native-reanimated";
import type { MassagedData, SidedNumber, ViewWindow } from "../../types";

export type CartesianContextValue = {
  data: MassagedData;
  inputWindow: ViewWindow;
  outputWindow: ViewWindow;
  tracking: {
    isActive: boolean;
    x: SharedValue<number>;
  };
  domainPadding?: SidedNumber;
};
export const CartesianContext = React.createContext<CartesianContextValue>({
  data: { x: [], y: {} },
  inputWindow: {} as ViewWindow,
  outputWindow: {} as ViewWindow,
  tracking: {
    isActive: false,
    x: null as unknown as SharedValue<number>,
  },
});

export const useCartesianContext = () => React.useContext(CartesianContext);
