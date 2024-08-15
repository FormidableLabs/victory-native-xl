import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Canvas,
  Circle,
  LinearGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { Pie, PolarChart } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "./consts/colors";
import { descriptionForRoute } from "./consts/routes";

function calculateGradientPoints(
  radius: number,
  startAngle: number,
  endAngle: number,
  centerX: number,
  centerY: number,
) {
  // Calculate the midpoint angle of the slice for a central gradient effect
  const midAngle = (startAngle + endAngle) / 2;

  // Convert angles from degrees to radians
  const startRad = (Math.PI / 180) * startAngle;
  const midRad = (Math.PI / 180) * midAngle;

  // Calculate start point (inner edge near the pie's center)
  const startX = centerX + radius * 0.5 * Math.cos(startRad);
  const startY = centerY + radius * 0.5 * Math.sin(startRad);

  // Calculate end point (outer edge of the slice)
  const endX = centerX + radius * Math.cos(midRad);
  const endY = centerY + radius * Math.sin(midRad);

  return { startX, startY, endX, endY };
}

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 125;
function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff);
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}

const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

const DonutChartSingleDataPoint = () => {
  const [data] = useState(DATA(1));
  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart innerRadius={"50%"}>
        {({ slice }) => {
          const { startX, startY, endX, endY } = calculateGradientPoints(
            slice.radius,
            slice.startAngle,
            slice.endAngle,
            slice.center.x,
            slice.center.y,
          );

          return (
            <Pie.Slice>
              <LinearGradient
                start={vec(startX, startY)}
                end={vec(endX, endY)}
                colors={[slice.color, `${slice.color}50`]}
                positions={[0, 1]}
              />
            </Pie.Slice>
          );
        }}
      </Pie.Chart>
    </PolarChart>
  );
};

const PieChartSingleDataPoint = () => {
  const [data] = useState(DATA(1));
  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart />
    </PolarChart>
  );
};
const PieChartMultipleDataPoints = () => {
  const [data] = useState(DATA(10));
  return (
    <View style={{ flex: 1 }}>
      <PolarChart
        data={data}
        labelKey={"label"}
        valueKey={"value"}
        colorKey={"color"}
      >
        <Pie.Chart>
          {({ slice }) => {
            const { startX, startY, endX, endY } = calculateGradientPoints(
              slice.radius,
              slice.startAngle,
              slice.endAngle,
              slice.center.x,
              slice.center.y,
            );

            return (
              <Pie.Slice>
                <LinearGradient
                  start={vec(startX, startY)}
                  end={vec(endX, endY)}
                  colors={[slice.color, `${slice.color}50`]}
                  positions={[0, 1]}
                />
              </Pie.Slice>
            );
          }}
        </Pie.Chart>
      </PolarChart>
      <View style={styles.legend}>
        {data.map((d, i) => (
          <View key={i} style={styles.legendItemContainer}>
            <Canvas style={styles.legendItemCanvas}>
              <Circle
                c={vec(
                  styles.legendItemCanvas.height / 2,
                  styles.legendItemCanvas.height / 2,
                )}
                r={styles.legendItemCanvas.height / 2 - 1} // - 1 to prevent clipping
                color={d.color}
              />
            </Canvas>
            <Text>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const PieChartWithInsets = () => {
  const [data] = useState(DATA(6));
  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart>
        {({ slice }) => {
          const { startX, startY, endX, endY } = calculateGradientPoints(
            slice.radius,
            slice.startAngle,
            slice.endAngle,
            slice.center.x,
            slice.center.y,
          );

          return (
            <>
              <Pie.Slice>
                <LinearGradient
                  start={vec(startX, startY)}
                  end={vec(endX, endY)}
                  colors={[slice.color, `${slice.color}50`]}
                  positions={[0, 1]}
                />
              </Pie.Slice>
              <Pie.SliceAngularInset
                angularInset={{
                  angularStrokeWidth: 4,
                  angularStrokeColor: "white",
                }}
              />
            </>
          );
        }}
      </Pie.Chart>
    </PolarChart>
  );
};
const DonutChartWithInsets = () => {
  const [data] = useState(DATA(5));
  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart innerRadius={"50%"}>
        {({ slice }) => {
          const { startX, startY, endX, endY } = calculateGradientPoints(
            slice.radius,
            slice.startAngle,
            slice.endAngle,
            slice.center.x,
            slice.center.y,
          );

          return (
            <>
              <Pie.Slice>
                <LinearGradient
                  start={vec(startX, startY)}
                  end={vec(endX, endY)}
                  colors={[slice.color, `${slice.color}50`]}
                  positions={[0, 1]}
                />
              </Pie.Slice>
              <Pie.SliceAngularInset
                angularInset={{
                  angularStrokeWidth: 5,
                  angularStrokeColor: "white",
                }}
              />
            </>
          );
        }}
      </Pie.Chart>
    </PolarChart>
  );
};

const PieChartSimpleNoCustomizations = () => {
  const [data] = useState(DATA(5));
  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart />
    </PolarChart>
  );
};
const PieChartSimpleCustomLegend = () => {
  const [data] = useState(DATA(5));
  return (
    <View style={{ flex: 1 }}>
      <PolarChart
        data={data}
        labelKey={"label"}
        valueKey={"value"}
        colorKey={"color"}
      >
        <Pie.Chart />
      </PolarChart>
      <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 5 }}>
        {data.map((d, index) => {
          return (
            <View
              key={index}
              style={{
                marginRight: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Canvas style={{ height: 12, width: 12, marginRight: 4 }}>
                <Rect
                  rect={{ x: 0, y: 0, width: 12, height: 12 }}
                  color={d.color}
                />
              </Canvas>
              <Text>{d.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const HalfDonutChart = () => {
  const [data] = useState(DATA(2));

  return (
    <PolarChart
      data={data}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
    >
      <Pie.Chart innerRadius={"50%"} circleSweepDegrees={180} startAngle={180}>
        {() => {
          return (
            <>
              <Pie.Slice />
              <Pie.SliceAngularInset
                angularInset={{
                  angularStrokeWidth: 5,
                  angularStrokeColor: "white",
                }}
              />
            </>
          );
        }}
      </Pie.Chart>
    </PolarChart>
  );
};

export default function PieAndDonutCharts(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View style={{ flexGrow: 1, paddingHorizontal: 15 }}>
          <InfoCard style={{ flex: 0 }}>{description}</InfoCard>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Pie Chart with No Customizations</Text>
          <PieChartSimpleNoCustomizations />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Donut Chart with Insets</Text>
          <DonutChartWithInsets />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Donut Chart with Single Data Point</Text>
          <DonutChartSingleDataPoint />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Pie Chart with Single Data Point</Text>
          <PieChartSingleDataPoint />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Pie Chart with Multiple Data Points</Text>
          <PieChartMultipleDataPoints />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.title}>Pie Chart with Insets</Text>
          <PieChartWithInsets />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Pie Chart with Custom Legend</Text>
          <PieChartSimpleCustomLegend />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Half Donut Chart</Text>
          <HalfDonutChart />
        </View>
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
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  legendItemContainer: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  legendItemCanvas: {
    height: 12,
    width: 12,
    marginRight: 2,
  },
});
