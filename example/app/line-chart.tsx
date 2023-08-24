import { Path, type SkPath, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  CartesianChart,
  useAnimatedPath,
  type XAxisSide,
  type YAxisSide,
} from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { InputSlider } from "example/components/InputSlider";
import { InputSegment } from "example/components/InputSegment";
import {
  optionsInitialState,
  optionsReducer,
} from "example/hooks/useOptionsReducer";
import type { AxisLabelPosition } from "lib/src/types";
import { InputColor } from "example/components/InputColor";
import { appColors } from "./consts/colors";
import { useDarkMode } from "react-native-dark";
import { useState } from "react";
import { Button } from "../components/Button";

const DATA = (numberPoints = 50) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
  }));

export default function LineChartPage() {
  const isDark = useDarkMode();
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
      scatterRadius,
      colors,
      domainPadding,
    },
    dispatch,
  ] = React.useReducer(optionsReducer, {
    ...optionsInitialState,
    domainPadding: 10,
    chartPadding: 10,
    strokeWidth: 2,
    colors: {
      stroke: isDark ? "#fafafa" : "#71717a",
      line: isDark ? "#71717a" : "#d4d4d8",
      xLabel: isDark ? appColors.text.dark : appColors.text.light,
      yLabel: isDark ? appColors.text.dark : appColors.text.light,
      scatter: appColors.tint,
    },
  });
  const font = useFont(inter, fontSize);
  const [data, setData] = useState(DATA());

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          xKey="day"
          padding={chartPadding}
          yKeys={["sales"]}
          gridOptions={{
            font,
            lineColor: colors.line,
            labelColor: { x: colors.xLabel!, y: colors.yLabel! },
            labelOffset: { x: xLabelOffset, y: yLabelOffset },
            tickCount: { x: xTickCount, y: yTickCount },
            axisSide: { x: xAxisSide, y: yAxisSide },
            labelPosition: {
              x: xAxisLabelPosition,
              y: yAxisLabelPosition,
            },
          }}
          data={data}
          domainPadding={domainPadding}
        >
          {({ paths }) => (
            <>
              <AnimatedPath
                path={paths["sales.line"]}
                color={colors.stroke!}
                strokeWidth={strokeWidth}
              />
              <AnimatedScatter
                path={paths["sales.scatter"]({ radius: scatterRadius })}
                color={colors.scatter!}
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 10,
            marginBottom: 16,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => setData((data) => [...data].reverse())}
            title="Shuffle Data"
          />
          <Button
            style={{ flex: 1 }}
            onPress={() =>
              setData((data) => [
                ...data,
                {
                  day: data.length + 1,
                  sales: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                },
              ])
            }
            title="Add Point"
          />
        </View>

        <InputSlider
          label="Domain Padding"
          maxValue={100}
          minValue={0}
          step={5}
          value={domainPadding}
          onChange={(val) =>
            dispatch({ type: "SET_DOMAIN_PADDING", payload: val })
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
          label="Path Width"
          maxValue={32}
          minValue={1}
          step={1}
          value={strokeWidth}
          onChange={(val) =>
            dispatch({ type: "SET_STROKE_WIDTH", payload: val })
          }
        />
        <InputColor
          label="Path Color"
          color={colors.stroke}
          onChange={(val) =>
            dispatch({ type: "SET_COLORS", payload: { stroke: val } })
          }
        />
        <InputSlider
          label="Point Radius"
          maxValue={32}
          minValue={2}
          step={1}
          value={scatterRadius}
          onChange={(val) =>
            dispatch({ type: "SET_SCATTER_RADIUS", payload: val })
          }
        />
        <InputColor
          label="Point Color"
          color={colors.scatter}
          onChange={(val) =>
            dispatch({ type: "SET_COLORS", payload: { scatter: val } })
          }
        />
        <InputColor
          label="Grid Color"
          color={colors.line}
          onChange={(val) =>
            dispatch({ type: "SET_COLORS", payload: { line: val } })
          }
        />
        <InputSlider
          label="Axis Label Font Size"
          maxValue={24}
          minValue={8}
          step={1}
          value={fontSize}
          onChange={(val) => dispatch({ type: "SET_FONT_SIZE", payload: val })}
        />
        <InputSlider
          label="Number of X-axis Grid Lines"
          maxValue={15}
          minValue={0}
          step={5}
          value={xTickCount}
          onChange={(val) =>
            dispatch({ type: "SET_X_TICK_COUNT", payload: val })
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
        <InputColor
          label="X-axis Label Color"
          color={colors.xLabel}
          onChange={(val) =>
            dispatch({ type: "SET_COLORS", payload: { xLabel: val } })
          }
        />
        <InputSlider
          label="Number of Y-axis Grid Lines"
          maxValue={20}
          minValue={0}
          step={5}
          value={yTickCount}
          onChange={(val) =>
            dispatch({ type: "SET_Y_TICK_COUNT", payload: val })
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
        <InputSegment<AxisLabelPosition>
          label="Y Axis Label position"
          onChange={(val) =>
            dispatch({ type: "SET_Y_AXIS_LABEL_POSITION", payload: val })
          }
          value={yAxisLabelPosition}
          values={["inset", "outset"]}
        />
        <InputSegment<YAxisSide>
          label="Y Axis side"
          onChange={(val) =>
            dispatch({ type: "SET_Y_AXIS_SIDE", payload: val })
          }
          value={yAxisSide}
          values={["left", "right"]}
        />
        <InputColor
          label="Y-axis Label Color"
          color={colors.yLabel}
          onChange={(val) =>
            dispatch({ type: "SET_COLORS", payload: { yLabel: val } })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const AnimatedPath = ({
  path,
  color,
  strokeWidth,
}: {
  path: SkPath;
  color: string;
  strokeWidth: number;
}) => {
  const animatedLinePath = useAnimatedPath(path, {
    type: "spring",
  });
  return (
    <Path
      path={animatedLinePath}
      style="stroke"
      color={color}
      strokeCap="round"
      strokeWidth={strokeWidth}
    />
  );
};

const AnimatedScatter = ({ path, color }: { path: SkPath; color: string }) => {
  const animatedLinePath = useAnimatedPath(path, {
    type: "spring",
  });
  return <Path path={animatedLinePath} style="fill" color={color} />;
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  chart: {
    flex: 1,
  },
  optionsScrollView: {
    flex: 0.5,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
