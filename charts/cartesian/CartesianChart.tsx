import { Canvas, clamp } from "@shopify/react-native-skia";
import * as React from "react";
import { PropsWithChildren } from "react";
import { LayoutChangeEvent } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Point } from "../types";
import { CartesianContext, CartesianContextValue } from "./CartesianContext";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
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
  // translateX is in terms of _input coords_
  const tx = useSharedValue(0);
  const savedTx = useSharedValue(0);

  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setSize(layout);
    },
    [],
  );

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
    () => size.width - valueFromPadding(padding, "right"),
    [size.width, padding],
  );
  const oymin = useDerivedValue(
    () => size.height - valueFromPadding(padding, "bottom"),
    [size.height, padding],
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

  const value = React.useMemo<CartesianContextValue>(
    () => ({
      data,
      inputWindow: {
        xMin: ixmin,
        xMax: ixmax,
        yMin: iymin,
        yMax: iymax,
      },
      outputWindow: {
        xMin: oxmin,
        xMax: oxmax,
        yMin: oymin,
        yMax: oymax,
      },
    }),
    [data],
  );

  // TODO: Need to map this so we keep focal point
  const pinchFocal = useSharedValue({ x: 0, relLeft: 0 });
  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      pinchFocal.value.x = map(
        e.focalX,
        oxmin.value,
        oxmax.value,
        ixmin.value,
        ixmax.value,
      );
      pinchFocal.value.relLeft = e.focalX / (oxmax.value - oxmin.value);
    })
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);

      const newTx =
        _ixmax.value -
        _ixmin.value -
        (ixmax.value - ixmin.value) -
        (_ixmax.value - pinchFocal.value.x) +
        (1 - pinchFocal.value.relLeft) * (ixmax.value - ixmin.value);

      tx.value = clamp(
        newTx,
        0,
        _ixmax.value - _ixmin.value - (ixmax.value - ixmin.value),
      );
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const dx =
        ((ixmax.value - ixmin.value) / (oxmax.value - oxmin.value)) *
        e.translationX;

      tx.value = clamp(
        savedTx.value - dx,
        0,
        _ixmax.value - _ixmin.value - (ixmax.value - ixmin.value),
      );

      console.log(tx.value);
    })
    .onEnd(() => {
      savedTx.value = tx.value;
    })
    .minPointers(2)
    .minDistance(5);

  const g = Gesture.Race(pan, pinch);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={g}>
        <Canvas style={{ flex: 1 }} onLayout={onLayout}>
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
