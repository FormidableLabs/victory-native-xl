import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { getTransformComponents } from "lib/src/utils/transform";
import type { ChartTransformState } from "../hooks/useChartTransformState";

interface CartesianTransformContext {
  k: number;
  kx: number;
  ky: number;
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
  const [transform, setTransform] = useState<{
    k: number;
    kx: number;
    ky: number;
    tx: number;
    ty: number;
  }>(() => {
    const components = getTransformComponents(undefined);
    return {
      k: components.scaleX,
      kx: components.scaleX,
      ky: components.scaleY,
      tx: components.translateX,
      ty: components.translateY,
    };
  });

  // This is done in a useEffect to prevent Reanimated warning
  // about setting shared value in the render phase
  useEffect(() => {
    if (transformState) {
      setTransform(() => {
        const components = getTransformComponents(transformState.matrix.value);
        return {
          k: components.scaleX,
          kx: components.scaleX,
          ky: components.scaleY,
          tx: components.translateX,
          ty: components.translateY,
        };
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimatedReaction(
    () => {
      return getTransformComponents(transformState?.matrix.value);
    },
    (cv, pv) => {
      if (
        cv.scaleX !== pv?.scaleX ||
        cv.scaleY !== pv.scaleY ||
        cv.translateX !== pv.translateX ||
        cv.translateY !== pv.translateY
      ) {
        runOnJS(setTransform)({
          k: cv.scaleX,
          kx: cv.scaleX,
          ky: cv.scaleY,
          tx: cv.translateX,
          ty: cv.translateY,
        });
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
