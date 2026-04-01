import { useFont, useFonts } from "@shopify/react-native-skia";
import * as React from "react";
import { useMemo } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  CartesianChart,
  Line,
  Scatter,
  createParagraphLabelRenderer,
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
import notoSansCJK from "../assets/Noto_Sans_SC/NotoSansSC-VariableFont_wght.ttf";
import { appColors } from "../consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";

const parseTickValues = (tickString?: string) =>
  tickString
    ?.split(",")
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v));

const DATA = (ticksX: number[], ticksY: number[]) => {
  const maxY = Math.max(...ticksY);
  const minY = Math.min(...ticksY);
  const maxX = Math.max(...ticksX);
  const minX = Math.min(...ticksX);
  const dX = maxX - minX;
  const dY = maxY - minY;

  return Array.from({ length: 10 }, (_, index) => ({
    day: minX + (dX * index) / 10,
    sales: Math.random() * dY + minY,
  }));
};

export default function AxisConfiguration(props: { segment: string }) {
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
      xAxisValues,
      yAxisValues,
    },
    dispatch,
  ] = React.useReducer(optionsReducer, {
    ...optionsInitialState,
    domainPadding: 10,
    chartPadding: 0,
    strokeWidth: 2,
    xAxisValues: "0,2,4,6,8",
    yAxisValues: "-1,0,1,2,4,6,8",
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
  const cjkFontMgr = useFonts({
    NotoSansCJK: [
      Platform.OS === "web" ? { default: notoSansCJK } : notoSansCJK,
    ],
  });

  const paragraphLabelRenderer = useMemo(
    () =>
      cjkFontMgr
        ? createParagraphLabelRenderer({
            textStyle: {
              fontSize,
              fontFamilies: ["NotoSansCJK"],
            },
            typefaceFontProvider: cjkFontMgr,
          })
        : undefined,
    [cjkFontMgr, fontSize],
  );
  const ticksX = useMemo(
    () => parseTickValues(xAxisValues) ?? [0, 10],
    [xAxisValues],
  );
  const ticksY = useMemo(
    () => parseTickValues(yAxisValues) ?? [0, 10],
    [yAxisValues],
  );

  const data = useMemo(() => DATA(ticksX, ticksY), [ticksX, ticksY]);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          xKey="day"
          padding={chartPadding}
          yKeys={["sales"]}
          xAxis={{
            font,
            labelRenderer: paragraphLabelRenderer,
            lineWidth: 0,
            lineColor: colors.xLine!,
            labelColor: colors.xLabel!,
            labelOffset: xLabelOffset,
            tickValues: ticksX,
            tickCount: xTickCount,
            axisSide: xAxisSide,
            labelPosition: xAxisLabelPosition,
            formatXLabel: (value) => {
              return customXLabel ? `${value} ${customXLabel}` : `${value}`;
            },
          }}
          yAxis={[
            {
              font,
              labelRenderer: paragraphLabelRenderer,
              lineWidth: 2,
              lineColor: colors.yLine!,
              labelColor: colors.yLabel!,
              labelOffset: yLabelOffset,
              tickValues: ticksY,
              tickCount: yTickCount,
              axisSide: yAxisSide,
              labelPosition: yAxisLabelPosition,
              formatYLabel: (value) => {
                return customYLabel ? `${value} ${customYLabel}` : `${value}`;
              },
              yKeys: ["sales"],
            },
          ]}
          frame={{
            lineWidth: 0,
            lineColor: colors.frameLine!,
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
        <View style={{ flexDirection: "row" }}>
          <InputText
            label="X Tick Values"
            placeholder="Comma separated"
            value={xAxisValues}
            onChangeText={(val) =>
              dispatch({
                type: "SET_X_AXIS_VALUES",
                payload: val,
              })
            }
          />
          {/** Spacer */}
          <View style={{ width: 10 }} />
          <InputText
            label="Y Tick Values"
            placeholder="Comma separated"
            value={yAxisValues}
            onChangeText={(val) =>
              dispatch({
                type: "SET_Y_AXIS_VALUES",
                payload: val,
              })
            }
          />
        </View>
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
