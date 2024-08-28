import * as React from "react";
import {
  CartesianChart,
  Line,
  useChartPressState,
  type Scale,
} from "victory-native";
import { Circle, Shader, Skia, useFont } from "@shopify/react-native-skia";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InfoCard } from "../components/InfoCard";
import { AnimatedText } from "../components/AnimatedText";
import { Text } from "../components/Text";
import { descriptionForRoute } from "./consts/routes";

interface HorizontalBandsShaderProps {
  yScale: Scale;
  thresholds: [number, [number, number, number]][];
}

function HorizontalBandsShader({
  yScale,
  thresholds,
}: HorizontalBandsShaderProps) {
  const reversedThresholds = thresholds.toReversed();
  const thresholdsYValues = reversedThresholds.map(([value]) => yScale(value));
  const thresholdsColors = reversedThresholds
    .map(([_, col]) => col)
    .reduce((acc, cur) => {
      return [...acc, ...cur];
    }, [] as number[]);

  const horizonalBandsShader = React.useMemo(() => {
    const bandsLength = thresholdsYValues.length;

    return Skia.RuntimeEffect.Make(`
      uniform float thresholdsYValues[${bandsLength}];
      uniform vec3 thresholdsColors[${bandsLength}];

      vec4 main(vec2 xy) {

        for (int i=0; i<${bandsLength}; i++) {
          if (xy.y < thresholdsYValues[i]) {
            return vec4(thresholdsColors[i], 1);
          }
        }

        return vec4(0,0,0,1);
      }
    `)!;
  }, [thresholdsYValues.length]);

  return (
    <Shader
      source={horizonalBandsShader}
      uniforms={{
        thresholdsYValues: new Float32Array(thresholdsYValues),
        thresholdsColors: new Float32Array(thresholdsColors),
      }}
    />
  );
}

export default function OrdinalDataScreen(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const { state } = useChartPressState({ x: "Nothing", y: { high: 0 } });
  const activeX = state.x.value;
  const day = useDerivedValue(() => activeX.value || "");
  const isDark = useDarkMode();

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={DATA}
          xKey="day"
          domainPadding={40}
          padding={{ top: 25, left: 10, right: 10, bottom: 10 }}
          yKeys={["high"]}
          axisOptions={{
            font,
            formatXLabel: (i) => i || "",
            formatYLabel: (i) => `${i}°`,
            tickCount: { x: 7, y: 10 },
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
          }}
          chartPressState={state}
        >
          {({ points, yScale }) => {
            return (
              <>
                <Line
                  points={points.high}
                  color={appColors.tint}
                  strokeWidth={5}
                  strokeCap="round"
                  strokeJoin="round"
                >
                  <HorizontalBandsShader
                    thresholds={[
                      [0, [1, 0, 0]],
                      [55, [1, 1, 0]],
                      [60, [0, 1, 1]],
                      [65, [1, 0, 1]],
                    ]}
                    yScale={yScale}
                  />
                </Line>

                {points.high.map(({ x, y, yValue }) => (
                  <AnimatedCircle
                    key={`circle-${x}-${y}`}
                    x={x}
                    y={y ?? 0}
                    radius={state.x.position.value === x ? 12 : 0}
                    color={"#f00"}
                  />
                ))}
              </>
            );
          }}
        </CartesianChart>
      </View>
      <View style={styles.selectionContainer}>
        <AnimatedText style={styles.animatedText} text={day} />
        <Text style={{ fontSize: 18 }}> is selected.</Text>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard>{description}</InfoCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const AnimatedCircle = ({
  x,
  y,
  radius,
  color,
}: {
  x: number;
  y: number;
  radius: number;
  color: string;
}) => {
  const animatedRadius = useSharedValue(0);
  useEffect(() => {
    animatedRadius.value = withSpring(radius);
  }, [animatedRadius, radius]);
  return <Circle r={animatedRadius} cx={x} cy={y} color={color} style="fill" />;
};

const DATA = [
  { day: "Mon", high: 50 + 20 * Math.random() },
  { day: "Tue", high: 50 + 20 * Math.random() },
  { day: "Wed", high: 50 + 20 * Math.random() },
  { day: "Thu", high: 50 + 20 * Math.random() },
  { day: "Fri", high: 50 + 20 * Math.random() },
  { day: "Sat", high: 50 + 20 * Math.random() },
  { day: "Sun", high: 50 + 20 * Math.random() },
];

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
  selectionContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
  },
  animatedText: {
    fontSize: 18,
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
  },
  optionsScrollView: {
    flex: 1,
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
