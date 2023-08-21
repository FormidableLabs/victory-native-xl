import { Path, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { View } from "react-native";
import { CartesianChart, type XAxisSide, type YAxisSide } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { InputSlider } from "example/components/InputSlider";
import { InputSegment } from "example/components/InputSegment";
import {
  optionsInitialState,
  optionsReducer,
} from "example/hooks/useOptionsReducer";
import type { AxisLabelPosition } from "lib/src/types";
import { InputColor } from "example/components/InputColor";

const DATA = Array.from({ length: 10 }, (_, index) => ({
  day: index + 1,
  sales: Math.floor(Math.random() * (50 - 5 + 1)) + 5,
}));

export default function LineChartPage() {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [
    {
      fontSize,
      chartPadding,
      strokeWidth,
      xAxisSide,
      yAxisSide,
      xLabelOffset,
      yLabelOffset,
      xTickCount,
      yTickCount,
      xAxisLabelPosition,
      yAxisLabelPosition,
      colors,
    },
    dispatch,
  ] = React.useReducer(optionsReducer, {
    ...optionsInitialState,
    colors: {
      stroke: "#000000",
      axis: "#00000",
      line: "#878787",
      xLabel: "#000000",
      yLabel: "#000000",
    },
  });
  const font = useFont(inter, fontSize);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.667 }}>
          <CartesianChart
            xKey="day"
            padding={chartPadding}
            yKeys={["sales"]}
            gridOptions={{
              font,
              yLabelOffset,
              xLabelOffset,
              yTicks: yTickCount,
              xTicks: xTickCount,
              yAxisPosition: yAxisSide,
              xAxisPosition: xAxisSide,
              xLabelPosition: xAxisLabelPosition,
              yLabelPosition: yAxisLabelPosition,
              axisColor: colors.axis,
              lineColor: colors.line,
              labelColor: { x: colors.xLabel!, y: colors.yLabel! },
            }}
            data={DATA}
          >
            {({ paths }) => {
              return (
                <Path
                  path={paths["sales.line"]}
                  style="stroke"
                  color={colors.stroke}
                  strokeCap="round"
                  strokeWidth={strokeWidth}
                />
              );
            }}
          </CartesianChart>
        </View>
        <BottomSheet ref={bottomSheetRef} index={0} snapPoints={["5%", "30%"]}>
          <BottomSheetScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 15,
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <InputColor
              label="Axis Color"
              color={colors.axis}
              onChange={(val) =>
                dispatch({ type: "SET_COLORS", payload: { axis: val } })
              }
            />
            <InputColor
              label="Line Color"
              color={colors.line}
              onChange={(val) =>
                dispatch({ type: "SET_COLORS", payload: { line: val } })
              }
            />
            <InputColor
              label="Stroke Color"
              color={colors.stroke}
              onChange={(val) =>
                dispatch({ type: "SET_COLORS", payload: { stroke: val } })
              }
            />
            <InputColor
              label="X-axis Label Color"
              color={colors.xLabel}
              onChange={(val) =>
                dispatch({ type: "SET_COLORS", payload: { xLabel: val } })
              }
            />
            <InputColor
              label="Y-axis Label Color"
              color={colors.yLabel}
              onChange={(val) =>
                dispatch({ type: "SET_COLORS", payload: { yLabel: val } })
              }
            />
            <InputSlider
              label="Stroke Width"
              maxValue={32}
              minValue={1}
              step={1}
              value={strokeWidth}
              onChange={(val) =>
                dispatch({ type: "SET_STROKE_WIDTH", payload: val })
              }
            />
            <InputSlider
              label="X-axis Label Offset"
              maxValue={12}
              minValue={0}
              step={1}
              value={xLabelOffset}
              onChange={(val) =>
                dispatch({ type: "SET_X_LABEL_OFFSET", payload: val })
              }
            />
            <InputSlider
              label="Y-axis Label Offset"
              maxValue={12}
              minValue={0}
              step={1}
              value={yLabelOffset}
              onChange={(val) =>
                dispatch({ type: "SET_Y_LABEL_OFFSET", payload: val })
              }
            />
            <InputSlider
              label="Chart Padding"
              maxValue={20}
              minValue={0}
              step={1}
              value={chartPadding}
              onChange={(val) =>
                dispatch({ type: "SET_CHART_PADDING", payload: val })
              }
            />
            <InputSlider
              label="Font Size"
              maxValue={24}
              minValue={8}
              step={1}
              value={fontSize}
              onChange={(val) =>
                dispatch({ type: "SET_FONT_SIZE", payload: val })
              }
            />
            <InputSlider
              label="Number of ticks on X axis"
              maxValue={15}
              minValue={0}
              step={5}
              value={xTickCount}
              onChange={(val) =>
                dispatch({ type: "SET_X_TICK_COUNT", payload: val })
              }
            />
            <InputSlider
              label="Number of ticks on Y axis"
              maxValue={20}
              minValue={0}
              step={5}
              value={yTickCount}
              onChange={(val) =>
                dispatch({ type: "SET_Y_TICK_COUNT", payload: val })
              }
            />
            <InputSegment<YAxisSide>
              label="Y Axis side"
              onChange={(val) =>
                dispatch({ type: "SET_Y_AXIS_SIDE", payload: val })
              }
              value={yAxisSide}
              values={["left", "right"]}
            />
            <InputSegment<XAxisSide>
              label="X Axis side"
              onChange={(val) =>
                dispatch({ type: "SET_X_AXIS_SIDE", payload: val })
              }
              value={xAxisSide}
              values={["top", "bottom"]}
            />
            <InputSegment<AxisLabelPosition>
              label="X Axis Label position"
              onChange={(val) =>
                dispatch({ type: "SET_X_AXIS_LABEL_POSITION", payload: val })
              }
              value={xAxisLabelPosition}
              values={["inset", "outset"]}
            />
            <InputSegment<AxisLabelPosition>
              label="Y Axis Label position"
              onChange={(val) =>
                dispatch({ type: "SET_Y_AXIS_LABEL_POSITION", payload: val })
              }
              value={yAxisLabelPosition}
              values={["inset", "outset"]}
            />
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </>
  );
}
