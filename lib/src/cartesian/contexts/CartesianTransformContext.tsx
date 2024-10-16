import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import type { ChartTransformState } from "../hooks/useChartTransformState";

interface CartesianTransformContext {
  k: number;
  tx: number;
  ty: number;
}

const CartesianTransformContext = createContext<
  CartesianTransformContext | undefined
>(undefined);

type CartesianTransformProviderProps = PropsWithChildren<{
  transformState?: ChartTransformState;
}>;
export const CartesianTransformProvider = ({
  transformState,
  children,
}: CartesianTransformProviderProps) => {
  const getTransformComponents = (
    transformState: ChartTransformState | undefined,
  ) => {
    "worklet";
    return {
      k: transformState?.transformMatrix.value.get()[0] || 1,
      tx: transformState?.transformMatrix.value.get()[2] || 0,
      ty: transformState?.transformMatrix.value.get()[5] || 0,
    };
  };
  const [transform, setTransform] = useState<{
    k: number;
    tx: number;
    ty: number;
  }>(getTransformComponents(transformState));

  useAnimatedReaction(
    () => {
      return getTransformComponents(transformState);
    },
    (cv, pv) => {
      if (cv.k != pv?.k || cv.tx != pv.tx || cv.ty !== pv.ty) {
        runOnJS(setTransform)(cv);
      }
    },
  );

  return (
    <CartesianTransformContext.Provider value={{ ...transform }}>
      {children}
    </CartesianTransformContext.Provider>
  );
};

export const useCartesianTransformContext = () => {
  const context = useContext(CartesianTransformContext);

  if (context === undefined) {
    throw new Error(
      "useCartesianTransformContext must be used within a CartesianTransformProvider",
    );
  }

  return context;
};
