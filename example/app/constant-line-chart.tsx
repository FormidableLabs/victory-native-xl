import {
  useFont,
  Line as SKLine,
  vec,
  Skia,
  Path,
} from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";
import type { PointsArray, Scale } from "lib/src/types";
import { useDarkMode } from "react-native-dark";

import {
  optionsInitialState,
  optionsReducer,
} from "example/hooks/useOptionsReducer";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;

const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: randomNumber(),
    constant: 33,
  }));

export default function ConstantLineChartPage() {
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
  const [data] = useState(DATA());

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          xKey="day"
          padding={chartPadding}
          yKeys={["sales", "constant"]}
          axisOptions={{
            font,
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
          {({ points, xScale, yScale }) => (
            <>
              {/* dashed line via Skia path */}
              <DashedFixedLine
                data={points.constant}
                xScale={xScale}
                yScale={yScale}
              />
              {/* straight line via Skia Line */}
              <StraightFixedLine
                data={points.constant}
                xScale={xScale}
                yScale={yScale}
              />
              {/* example of a "straight line", using only data */}
              <Line
                points={points.sales}
                curveType={curveType}
                color={colors.stroke!}
                strokeWidth={strokeWidth}
                animate={{ type: "spring" }}
              />
              <Line
                points={points.constant}
                curveType={curveType}
                color={"black"}
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
      ></ScrollView>
    </SafeAreaView>
  );
}

type FixedLine = {
  xScale: Scale;
  yScale: Scale;
  data: PointsArray;
};
const DashedFixedLine = ({ data, xScale, yScale }: FixedLine) => {
  const dottedLinePath = Skia.Path.Make();
  dottedLinePath.moveTo(xScale(0), yScale(46));
  dottedLinePath.lineTo(
    xScale((data[data.length - 1]!.xValue as number) + 1),
    yScale(46),
  );
  dottedLinePath.dash(8, 4, 0);

  return (
    <Path
      path={dottedLinePath}
      color={"pink"}
      style="stroke"
      strokeJoin="round"
      strokeWidth={2}
    />
  );
};
const StraightFixedLine = ({ data, xScale, yScale }: FixedLine) => {
  return (
    <SKLine
      // start at x 0, y is fixed height that you want to show line at; determine this value however you want.
      p1={vec(xScale(0), yScale(40))}
      p2={vec(
        // end at data length xValue + 1 (so the line extends to the end of the chart) , y is fixed height that you want to show line at; determine this value however you want.
        xScale((data[data.length - 1]!.xValue as number) + 1),
        yScale(40),
      )}
      color="lightblue"
      style="stroke"
      strokeWidth={4}
    />
  );
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
