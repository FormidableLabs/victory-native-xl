import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  DashPathEffect,
  useFont,
  useImage,
  Image,
  Skia,
  Paragraph,
  TileMode,
} from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const DATA = [
  { temperature: 10, day: 1 },
  { temperature: 20, day: 2 },
  { temperature: 30, day: 3 },
  { temperature: 20, day: 4 },
  { temperature: 60, day: 5 },
  { temperature: 15, day: 6 },
];

const ChartWithRemoteImages = () => {
  const font = useFont(inter, 12);
  const [data] = useState(DATA);

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="day"
        padding={5}
        yKeys={["temperature"]}
        domainPadding={{ left: 12, right: 50, top: 0 }}
        data={data}
        domain={{ y: [0, 100] }}
        xAxis={{
          font,
          labelOffset: 14,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        }}
        yAxis={[
          {
            tickValues: [15, 50, 80],
            tickImages: [
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
            ],
            labelOffset: 12,
            font,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          },
        ]}
      >
        {({ points }) => {
          return (
            <Line
              strokeWidth={3}
              color={"#f7ce64"}
              curveType="natural"
              points={points.temperature}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

const ChartWithLocalImages = () => {
  const font = useFont(inter, 12);
  const [data] = useState(DATA);

  const warmImage = useImage(require("../assets/warm.png"));
  const medImage = useImage(require("../assets/med.png"));
  const coldImage = useImage(require("../assets/cold.png"));

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="day"
        padding={5}
        yKeys={["temperature"]}
        domainPadding={{ left: 12, right: 50, top: 0 }}
        data={data}
        domain={{ y: [0, 100] }}
        xAxis={{
          font,
          labelOffset: 14,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        }}
        yAxis={[
          {
            tickValues: [15, 50, 80],
            tickImages: [
              { skImage: coldImage, width: 32, height: 32 },
              { skImage: medImage, width: 32, height: 32 },
              { skImage: warmImage, width: 32, height: 32 },
            ],
            labelOffset: 12,
            font,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          },
        ]}
      >
        {({ points }) => {
          return (
            <Line
              strokeWidth={3}
              color={"#f7ce64"}
              curveType="natural"
              points={points.temperature}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

// copied from https://shopify.github.io/react-native-skia/docs/text/paragraph/
const source = Skia.RuntimeEffect.Make(`
  uniform vec4 position;
  uniform vec4 colors[4];
   
  vec4 main(vec2 pos) {
    vec2 uv = (pos - vec2(position.x, position.y))/vec2(position.z, position.w);
    vec4 colorA = mix(colors[0], colors[1], uv.x);
    vec4 colorB = mix(colors[2], colors[3], uv.x);
    return mix(colorA, colorB, uv.y);
  }`)!;

const colors = [
  // #dafb61
  0.85, 0.98, 0.38, 1.0,
  // #61dafb
  0.38, 0.85, 0.98, 1.0,
  // #fb61da
  0.98, 0.38, 0.85, 1.0,
  // #61fbcf
  0.38, 0.98, 0.81, 1.0,
];

const ChartWithRenderCustomYLabel = () => {
  const font = useFont(inter, 12);
  const [data] = useState(DATA);

  const warmImage = useImage(require("../assets/warm.png"));
  const medImage = useImage(require("../assets/med.png"));
  const coldImage = useImage(require("../assets/cold.png"));

  const images = [coldImage, medImage, warmImage];
  const paragraphMaker = useCallback((t: string) => {
    // Create a background paint.
    const backgroundPaint = Skia.Paint();
    backgroundPaint.setShader(source.makeShader([0, 0, 256, 256, ...colors]));

    // Create a foreground paint. We use a radial gradient.
    const foregroundPaint = Skia.Paint();
    foregroundPaint.setShader(
      Skia.Shader.MakeRadialGradient(
        { x: 0, y: 0 },
        256,
        [Skia.Color("magenta"), Skia.Color("yellow")],
        null,
        TileMode.Clamp,
      ),
    );

    const para = Skia.ParagraphBuilder.Make()
      .pushStyle(
        {
          fontFamilies: ["Roboto"],
          fontSize: 12,
          fontStyle: { weight: 500 },
          color: Skia.Color("black"),
        },
        foregroundPaint,
        backgroundPaint,
      )
      .addText(`Label ${t}\nSkia`)
      .pop()
      .build();
    return para;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="day"
        padding={20}
        yKeys={["temperature"]}
        domainPadding={{ left: 12, right: 50, top: 0 }}
        data={data}
        domain={{ y: [0, 100], x: [0, 7] }}
        xAxis={{
          font,
          labelOffset: 14,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          renderXLabel: ({ x, y, content, canFitContent }) => {
            if (!canFitContent) {
              return null;
            }

            return (
              <Paragraph
                paragraph={paragraphMaker(content)}
                x={x}
                y={y}
                width={42}
              />

              // <SkiaText
              //   key={`y-${y}-${x}`}
              //   color={"green"}
              //   text={`Hi ${content}`}
              //   font={font}
              //   y={y}
              //   x={x}
              // />
            );
          },
        }}
        yAxis={[
          {
            tickValues: [15, 50, 80],
            renderYLabel: ({ x, y, index }) => {
              return (
                <Image
                  image={images[index]!}
                  fit="contain"
                  y={y}
                  x={x}
                  width={32}
                  height={32}
                />
              );
            },
            labelOffset: 12,
            font,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          },
        ]}
      >
        {({ points }) => {
          return (
            <Line
              strokeWidth={3}
              color={"#f7ce64"}
              curveType="natural"
              points={points.temperature}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default function AxisIconsChartPage() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <ScrollView>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Chart with local images as tick values on the Y axis
            </Text>
            <ChartWithLocalImages />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Chart using renderYLabel and renderXLabel for full customization
            </Text>
            <ChartWithRenderCustomYLabel />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Chart with remote images as tick values on the Y axis
            </Text>
            <ChartWithRemoteImages />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  chartContainer: {
    height: 400,
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: appColors.cardBorder.light,
    $dark: {
      borderBottomColor: appColors.cardBorder.dark,
    },
  },
  title: { marginBottom: 10, fontSize: 16, fontWeight: "bold" },
});
