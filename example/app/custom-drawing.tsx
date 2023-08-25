import { vec, type SkPoint, useFont, Points } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { useDarkMode } from "react-native-dark";
import { InputSlider } from "../components/InputSlider";
import { InputColor } from "../components/InputColor";
import { useState } from "react";

const DATA = Array.from({ length: 13 }, (_, index) => ({
  day: index + 1,
  stars: Math.floor(Math.random() * (50 - 5 + 1)) + 5,
}));

const calculateStarPoints = (
  centerX: number,
  centerY: number,
  radius: number,
  points: number,
): SkPoint[] => {
  const vectors: SkPoint[] = [];
  for (let i = 0; i <= 2 * points; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (i % 2 === 0 ? radius * 2 : radius);
    const y = centerY + Math.sin(angle) * (i % 2 === 0 ? radius * 2 : radius);
    vectors.unshift(vec(x, y));
  }
  return vectors;
};

export default function LineChartPage() {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [numPoints, setNumPoints] = useState(5);
  const [shapeColor, setShapeColor] = useState<string>(appColors.tint);

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="day"
            padding={10}
            yKeys={["stars"]}
            domainPadding={20}
            gridOptions={{
              lineColor: isDark ? "#71717a" : "#d4d4d8",
            }}
            axisOptions={{
              font,
              tickCount: 5,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
            }}
            data={DATA}
          >
            {({ points }) => {
              return (
                <>
                  {points.stars.map(({ x, y }) => {
                    return (
                      <React.Fragment key={`point-${x}-${y}`}>
                        <Points
                          points={calculateStarPoints(x, y, 5, numPoints)}
                          mode="polygon"
                          color={shapeColor}
                          strokeCap="round"
                          strokeWidth={2}
                        />
                      </React.Fragment>
                    );
                  })}
                </>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InputSlider
            label="Number of points"
            maxValue={8}
            minValue={3}
            step={1}
            value={numPoints}
            onChange={setNumPoints}
          />
          <InputColor
            label="Shape color"
            color={shapeColor}
            onChange={setShapeColor}
          />
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
  chart: {
    flex: 1.5,
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
