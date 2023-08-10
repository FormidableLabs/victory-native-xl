import * as React from "react";
import { SharedValue } from "react-native-reanimated";
import { Point, ViewWindow } from "../types";

export type CartesianContextValue = {
  data: Point[]; // TODO: needs to be dynamic?
  inputWindow: ViewWindow;
  outputWindow: ViewWindow;
};
export const CartesianContext = React.createContext<CartesianContextValue>({
  data: [],
  inputWindow: {} as ViewWindow,
  outputWindow: {} as ViewWindow,
});

export const useCartesianContext = () => React.useContext(CartesianContext);
