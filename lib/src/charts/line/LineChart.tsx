import * as React from "react";
import type { InputDatum } from "victory-native-skia";
import { transformInputData } from "../../utils/transformInputData2";
import { type LayoutChangeEvent } from "react-native";
import { Canvas, type SkPath, vec, Line } from "@shopify/react-native-skia";
import { makeLinearPath } from "./linearPath";
import {
  makeMutable,
  runOnJS,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import type { SidedNumber, TransformedData, ValueOf } from "../../types";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { findClosestPoint } from "../../utils/findClosestPoint";
import { valueFromSidedNumber } from "../../utils/valueFromSidedNumber";

type LineChartProps<T extends InputDatum> = {
  data: T[];
  xKey: string;
  yKeys: string[];
  // TODO: xScale, yScale
  // TODO: Axes
  padding?: SidedNumber;
  domainPadding?: SidedNumber;
  children: (args: {
    paths: SkPath[];
    isActive: boolean;
    xValue: SharedValue<ValueOf<InputDatum>>;
    xPosition: SharedValue<number>;
    yValues: SharedValue<ValueOf<InputDatum>>[];
    yPositions: SharedValue<number>[];
  }) => React.ReactNode;
};

export function LineChart<T extends InputDatum>({
  data,
  xKey,
  yKeys,
  padding,
  domainPadding,
  children,
}: LineChartProps<T>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setSize(layout);
    },
    [],
  );

  const tData = useSharedValue<TransformedData>({ ix: [], ox: [], y: [] });
  const { paths, xScale, yScale } = React.useMemo(() => {
    const { xScale, yScale, ..._tData } = transformInputData({
      data,
      xKey,
      yKeys,
      // TODO: These are likely going to need to change.
      // TODO: domainPadding needs to get applied at the scale level i think?
      outputWindow: {
        xMin:
          valueFromSidedNumber(padding, "left") +
          valueFromSidedNumber(domainPadding, "left"),
        xMax:
          size.width -
          (valueFromSidedNumber(padding, "right") +
            valueFromSidedNumber(domainPadding, "right")),
        yMin:
          valueFromSidedNumber(padding, "top") +
          valueFromSidedNumber(domainPadding, "top"),
        yMax:
          size.height -
          (valueFromSidedNumber(padding, "bottom") +
            valueFromSidedNumber(domainPadding, "bottom")),
      },
    });
    tData.value = _tData;

    const paths = yKeys.map((_, i) => {
      return makeLinearPath(_tData.ox, _tData.y[i]?.o || []);
    });

    return { tData, paths, xScale, yScale };
  }, [data, xKey, yKeys, size]);

  const [isTooltipActive, setIsTooltipActive] = React.useState(false);
  const tooltipXValue = useSharedValue<ValueOf<InputDatum>>(0);
  const tooltipXPosition = useSharedValue(0);
  const tooltipYValues = React.useRef(yKeys.map(() => makeMutable(0)));
  const tooltipYPositions = React.useRef(yKeys.map(() => makeMutable(0)));

  const pan = Gesture.Pan()
    .onStart(() => {
      runOnJS(setIsTooltipActive)(true);
    })
    .onUpdate((evt) => {
      const idx = findClosestPoint(tData.value.ox, evt.x);
      if (typeof idx !== "number") return;

      tooltipXValue.value = tData.value.ix[idx];
      tooltipXPosition.value = tData.value.ox[idx]!; // TODO: Missing values?

      yKeys.forEach((_, i) => {
        tooltipYValues.current[i]!.value = tData.value.y[i]!.i[idx]!;
        tooltipYPositions.current[i]!.value = tData.value.y[i]!.o[idx]!;
      });
    })
    .onEnd(() => {
      runOnJS(setIsTooltipActive)(false);
    });

  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <Canvas style={{ flex: 1 }} onLayout={onLayout}>
          {children({
            paths,
            isActive: isTooltipActive,
            xValue: tooltipXValue,
            xPosition: tooltipXPosition,
            yValues: tooltipYValues.current,
            yPositions: tooltipYPositions.current,
          })}
          {/* Throw in some dummy axes */}
          <Line
            p1={vec(xScale(x1!), yScale(y1!))}
            p2={vec(xScale(x1!), yScale(y2!))}
          />
          <Line
            p1={vec(xScale(x1!), yScale(y2!))}
            p2={vec(xScale(x2!), yScale(y2!))}
          />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
