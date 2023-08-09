import * as React from "react";
import { SharedValue } from "react-native-reanimated";
import { Point } from "../types";

type CartesianContextValue = {
  data: Point[]; // TODO: needs to be dynamic?
  ixmin: SharedValue<number>;
  ixmax: SharedValue<number>;
  iymin: SharedValue<number>;
  iymax: SharedValue<number>;
  oxmin: SharedValue<number>;
  oxmax: SharedValue<number>;
  oymin: SharedValue<number>;
  oymax: SharedValue<number>;
};
export const CartesianContext = React.createContext<CartesianContextValue>({
  data: [],
  ixmin: null as SharedValue<number>,
  ixmax: null as SharedValue<number>,
  iymin: null as SharedValue<number>,
  iymax: null as SharedValue<number>,
  oxmin: null as SharedValue<number>,
  oxmax: null as SharedValue<number>,
  oymin: null as SharedValue<number>,
  oymax: null as SharedValue<number>,
});

export const useCartesianContext = () => React.useContext(CartesianContext);
