import * as React from "react";
import { SharedValue } from "react-native-reanimated";
import { Point, ViewWindow } from "../types";

export type CartesianContextValue = {
  data: Point[]; // TODO: needs to be dynamic?
  inputWindow: ViewWindow;
  outputWindow: ViewWindow;
  tracking: {
    isActive: boolean;
    x: SharedValue<number>;
  };
};
export const CartesianContext = React.createContext<CartesianContextValue>({
  data: [],
  inputWindow: {} as ViewWindow,
  outputWindow: {} as ViewWindow,
  tracking: {
    isActive: false,
    x: null as SharedValue<number>,
  },
});

export const useCartesianContext = () => React.useContext(CartesianContext);
