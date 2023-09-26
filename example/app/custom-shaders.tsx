import {
  LinearGradient,
  Shader,
  Skia,
  useFont,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";
import { Button } from "../components/Button";

const generateData = () =>
  Array.from({ length: 12 }, (_, index) => {
    const low = Math.round(20 + 20 * Math.random());
    const high = Math.round(low + 3 + 20 * Math.random());

    return {
      month: new Date(2020, index).toLocaleString("default", {
        month: "short",
      }),
      low,
      high,
    };
  });

export default function CustomShadersPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(generateData);
  const [w, setW] = React.useState(0);
  const [h, setH] = React.useState(0);

  const time = useSharedValue(0);
  React.useEffect(() => {
    time.value = withRepeat(
      withTiming(30, { duration: 60 * 1000, easing: Easing.linear }),
      -1,
    );
  }, [time]);
  const uniforms = useDerivedValue(() => ({
    resW: w,
    resH: h,
    time: time.value,
  }));

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            data={data}
            xKey="month"
            yKeys={["low", "high"]}
            padding={16}
            domain={{ y: [0] }}
            domainPadding={{ top: 20 }}
            axisOptions={{ font, labelOffset: { x: 4, y: 8 } }}
            onChartBoundsChange={({ left, right, top, bottom }) => {
              setW(right - left);
              setH(bottom - top);
            }}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  points={points.high}
                  y0={chartBounds.bottom}
                  color="black"
                  curveType="catmullRom"
                  animate={{ type: "timing" }}
                >
                  <Shader source={mindbend} uniforms={uniforms} />
                </Area>
                <Area
                  points={points.low}
                  y0={chartBounds.bottom}
                  color="blue"
                  curveType="catmullRom"
                  animate={{ type: "timing" }}
                >
                  <LinearGradient
                    start={{ x: 0, y: chartBounds.bottom }}
                    end={{ x: 0, y: chartBounds.top }}
                    colors={["#000000", "#00000080"]}
                  />
                </Area>
                <Line
                  points={points.low}
                  color="black"
                  strokeWidth={4}
                  curveType="catmullRom"
                  animate={{ type: "timing" }}
                />
              </>
            )}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
          <Button
            title="Shuffle Data"
            onPress={() => setData(generateData())}
            style={{ width: "100%" }}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Modified from here: https://shaders.skia.org/?id=de2a4d7d893a7251eb33129ddf9d76ea517901cec960db116a1bbd7832757c1f
const mindbend = Skia.RuntimeEffect.Make(`
uniform float time;
uniform float resW;
uniform float resH;

float f(vec3 p) {
    p.z -= time * 10.;
    float a = p.z * .1;
    p.xy *= mat2(cos(a), sin(a), -sin(a), cos(a));
    return .1 - length(cos(p.xy) + sin(p.yz));
}

vec4 main(vec2 FC) { 
    vec3 d = .5 - FC.xy1 / resH;
    vec3 p=vec3(0);
    for (int i = 0; i < 32; i++) {
      p += f(p) * d;
    }
    return ((sin(p) + vec3(2, 5, 12)) / length(p)).xyz1;
}
`)!;

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
    maxHeight: 350,
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
