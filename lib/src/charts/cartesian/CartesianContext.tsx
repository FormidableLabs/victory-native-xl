// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from "react";
import { SharedValue } from "react-native-reanimated";
import { MassagedData, ViewWindow } from "../../types";

export type CartesianContextValue = {
  data: MassagedData;
  inputWindow: ViewWindow;
  outputWindow: ViewWindow;
  tracking: {
    isActive: boolean;
    x: SharedValue<number>;
  };
};
export const CartesianContext = React.createContext<CartesianContextValue>({
  data: { x: [], y: {} },
  inputWindow: {} as ViewWindow,
  outputWindow: {} as ViewWindow,
  tracking: {
    isActive: false,
    x: null as SharedValue<number>,
  },
});

export const useCartesianContext = () => React.useContext(CartesianContext);
