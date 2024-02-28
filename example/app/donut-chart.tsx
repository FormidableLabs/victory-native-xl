import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient, vec } from "@shopify/react-native-skia";
import { Pie } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Button } from "example/components/Button";
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

export default function DonutChart(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const [data, setData] = useState(DATA(5));

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View style={styles.chartContainer}>
          <Pie.Chart
            data={data}
            labelKey={"label"}
            valueKey={"value"}
            colorKey={"color"}
            innerRadius={"50%"}
            renderLegend={() => (
              <Pie.ChartLegend
                containerStyle={{
                  justifyContent: "center",
                }}
                position="bottom"
              >
                {({ slice }) => (
                  <Pie.ChartLegendItem
                    slice={slice}
                    formatLabel={(label) =>
                      `${label} - ${Math.round(slice.value)}`
                    }
                  />
                )}
              </Pie.ChartLegend>
            )}
          >
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
        </View>

        <View style={{ flexGrow: 1, padding: 15 }}>
          <InfoCard style={{ flex: 0, marginBottom: 16 }}>
            {description}
          </InfoCard>

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
              onPress={() => setData((data) => DATA(data.length))}
              title="Shuffle Data"
            />
          </View>
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
  },
});
