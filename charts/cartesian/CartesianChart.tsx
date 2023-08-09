import { Canvas } from "@shopify/react-native-skia";
import * as React from "react";
import { PropsWithChildren } from "react";
import { LayoutChangeEvent } from "react-native";
import {
  useAnimatedGestureHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CHART_VERTICAL_PADDING } from "../consts";
import { Point } from "../types";
import { CartesianContext } from "./CartesianContext";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { map } from "../interpolaters";

type CartesianChartProps<T extends Record<any, any>> = {
  data: T[];

  // TODO: Improve this. With axes, i don't know if this is right.
  padding?:
    | number
    | { left?: number; right?: number; top?: number; bottom?: number };
};

export function CartesianChart<T extends Point>({
  data,
  padding = 20,
  children,
}: PropsWithChildren<CartesianChartProps<T>>) {
  // Gestures?
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const savedTx = useSharedValue(0);

  const size = useSharedValue({ width: 0, height: 0 });
  const _ixmin = useSharedValue(Math.min(...data.map((d) => d.x)));
  const _ixmax = useSharedValue(Math.max(...data.map((d) => d.x)));
  const ixmin = useDerivedValue(
    () => _ixmin.value / scale.value + tx.value,
    [_ixmin, scale, tx],
  );
  const ixmax = useDerivedValue(
    () => _ixmax.value / scale.value + tx.value,
    [_ixmax, scale, tx],
  );
  const iymin = useSharedValue(Math.min(...data.map((d) => d.y)));
  // const iymin = useSharedValue(0);
  const iymax = useSharedValue(Math.max(...data.map((d) => d.y)));
  const oxmin = useDerivedValue(
    () => valueFromPadding(padding, "left"),
    [padding],
  );
  const oxmax = useDerivedValue(
    () => size.value.width - valueFromPadding(padding, "right"),
    [size.value.width, padding],
  );
  const oymin = useDerivedValue(
    () => size.value.height - valueFromPadding(padding, "bottom"),
    [size.value.height, padding],
  );
  const oymax = useDerivedValue(
    () => valueFromPadding(padding, "top"),
    [padding],
  );

  React.useEffect(() => {
    _ixmin.value = withTiming(Math.min(...data.map((d) => d.x)), {
      duration: 300,
    });
    _ixmax.value = withTiming(Math.max(...data.map((d) => d.x)), {
      duration: 300,
    });
    iymin.value = withTiming(Math.min(...data.map((d) => d.y)), {
      duration: 300,
    });
    iymax.value = withTiming(Math.max(...data.map((d) => d.y)), {
      duration: 300,
    });
  }, [data]);

  const c = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return null;
    return React.cloneElement(child, {});
  });

  const value = React.useMemo(
    () => ({
      data,
      ixmin,
      ixmax,
      iymin,
      iymax,
      oxmin,
      oxmax,
      oymin,
      oymax,
    }),
    [data],
  );

  // TODO: Need to map this so we keep focal point
  const pinchFocal = useSharedValue(0);
  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      // e.focalX
    })
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const dx =
        ((ixmax.value - ixmin.value) / (oxmax.value - oxmin.value)) *
        e.translationX;
      tx.value = savedTx.value - dx;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
    })
    .minDistance(1);

  const g = Gesture.Simultaneous(pinch, pan);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={g}>
        <Canvas style={{ flex: 1 }} onSize={size}>
          <CartesianContext.Provider value={value}>
            {children}
          </CartesianContext.Provider>
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const valueFromPadding = (
  padding: CartesianChartProps<any>["padding"],
  side: keyof Exclude<CartesianChartProps<any>["padding"], number>,
) => {
  "worklet";
  return typeof padding === "number" ? padding : padding[side] || 0;
};
