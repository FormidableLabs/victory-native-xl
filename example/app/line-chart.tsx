import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  CartesianChart,
  type CurveType,
  Line,
  Scatter,
  type XAxisSide,
  type YAxisSide,
} from "victory-native";
import type { AxisLabelPosition } from "lib/src/types";
import { useDarkMode } from "react-native-dark";
import { InputSlider } from "example/components/InputSlider";
import { InputSegment } from "example/components/InputSegment";
import {
  optionsInitialState,
  optionsReducer,
} from "example/hooks/useOptionsReducer";
import { InputColor } from "example/components/InputColor";
import { InputText } from "example/components/InputText";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;

const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: randomNumber(),
  }));

export default function LineChartPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
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
      curveType,
      customXLabel,
      customYLabel,
    },
    dispatch,
  ] = React.useReducer(optionsReducer, {
    ...optionsInitialState,
    domainPadding: 10,
    chartPadding: 10,
    strokeWidth: 2,
    colors: {
      stroke: isDark ? "#fafafa" : "#71717a",
      xLine: isDark ? "#71717a" : "#ffffff",
      yLine: isDark ? "#aabbcc" : "#ddfa55",
      frameLine: isDark ? "#444" : "#aaa",
      xLabel: isDark ? appColors.text.dark : appColors.text.light,
      yLabel: isDark ? appColors.text.dark : appColors.text.light,
      scatter: "#a78bfa",
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
          axisOptions={{
            font,
            lineWidth: { grid: { x: 0, y: 2 }, frame: 0 },
            lineColor: {
              grid: {
                x: colors.xLine!,
                y: colors.yLine!,
              },
              frame: colors.frameLine!,
            },
            labelColor: { x: colors.xLabel!, y: colors.yLabel! },
            labelOffset: { x: xLabelOffset, y: yLabelOffset },
            tickCount: { x: xTickCount, y: yTickCount },
            axisSide: { x: xAxisSide, y: yAxisSide },
            labelPosition: {
              x: xAxisLabelPosition,
              y: yAxisLabelPosition,
            },
            formatXLabel: (value) => {
              return customXLabel ? `${value} ${customXLabel}` : `${value}`;
            },
            formatYLabel: (value) => {
              return customYLabel ? `${value} ${customYLabel}` : `${value}`;
            },
          }}
          data={data}
          domainPadding={domainPadding}
        >
          {({ points }) => (
            <>
              <Line
                points={points.sales}
                curveType={curveType}
                color={colors.stroke!}
                strokeWidth={strokeWidth}
                animate={{ type: "spring" }}
              />
              <Scatter
                radius={scatterRadius}
                points={points.sales}
                animate={{ type: "spring" }}
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
        <InfoCard>{description}</InfoCard>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginVertical: 16,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => setData((data) => DATA(data.length))}
            title="Shuffle Data"
          />
          <Button
            style={{ flex: 1 }}
            onPress={() =>
              setData((data) => [
                ...data,
                {
                  day: data.length + 1,
                  sales: randomNumber(),
                },
              ])
            }
            title="Add Point"
          />
        </View>

        <InputSegment<CurveType>
          label="Curve Type"
          onChange={(val) => dispatch({ type: "SET_CURVE_TYPE", payload: val })}
          value={curveType}
          values={["linear", "natural", "cardinal", "step"]}
        />
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

        <View style={{ flexDirection: "row" }}>
          <InputText
            label="X Label Text"
            placeholder="Label text here..."
            value={customXLabel}
            onChangeText={(val) =>
              dispatch({ type: "SET_X_LABEL", payload: val })
            }
          />
          {/** Spacer */}
          <View style={{ width: 10 }} />
          <InputText
            label="Y Label Text"
            placeholder="Label text here..."
            value={customYLabel}
            onChangeText={(val) =>
              dispatch({ type: "SET_Y_LABEL", payload: val })
            }
          />
        </View>

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
